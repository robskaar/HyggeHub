# Pelle (6) as a figurine, in the style of robert.py: a round child's face, big brown eyes, a happy
# grin with a missing milk tooth; light brown hair showing under a cream baseball cap (six panels, a
# button, a curved peak) with Pikachu on the front; a short navy hoodie, open, over a white T-shirt, its
# hood lying behind his neck; navy shorts, white socks, sneakers.
#   blender --background --python scripts/blender/pelle.py -- out.png
import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(__file__))
import figure_lib as F  # noqa: E402
import figure_parts as P  # noqa: E402

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.abspath('pelle.png')
F.reset()

SKIN = '#f5cdb2'
HAIR = '#a07a52'
R = 0.33
HC = Vector((0, 0, 0.72))

head = P.Head(R, HC, SKIN, jaw=(0.86, 0.8, 0.6), cheeks=(0.42, 0.52, -0.32, 0.25), chin=None, nose=(0.08, 0.07, 0.07), eye=(0.37, 0.6, -0.12, 0.28))
head.paint(hairline=[(0.0, 0.9), (0.7, 0.95), (1.0, 1.15), (1.15, 1.75), (1.3, 1.75), (1.4, 1.62), (1.62, 1.62), (1.85, 2.1), (2.3, 2.45), (math.pi, 2.55)], hair_hex=HAIR, blush=0.9)
head.grin(width=0.27, up=-0.5, depth=0.12, gap_tooth=True, tongue=False)
head.eyes_('#7a4f2a', '#3a2412', inner_hex='#a36d3a', lash='child', lid=0.6)
head.brows('#7b5a3c', thick=0.035, arch=0.03, high=0.0)

# Hair under the cap: one smooth layer over the painted hairline (no loose tufts), a little longer at
# the nape and over the tops of the ears.
hair_m = F.material('hair', HAIR, rough=0.6, sheen=0.3)
def under_cap(co):
    v = co - (head.centre + Vector((0, R * 0.02, R * 0.03)))
    return head.hair_amount(co) > 0.5 and v.z < R * 0.22 - v.y * 0.24


F.shell(head.obj, under_cap, R * 0.05, R * 0.014, smooth=10, mat=hair_m, name='hair')

# ---------- the cap ----------
# A baseball cap: a crown that fits the head snugly with a clean edge (above the brows at the front,
# lower at the back), six sewn seams and a button; a wide brim sticking out forward, curving down a
# little at its sides; Pikachu embroidered flat on the front panel.
cap_m = F.fabric(F.material('cap', '#ece4d0', rough=0.85, sheen=0.5), scale=500, strength=0.15)
seam_m = F.material('seam', '#bdb093', rough=0.85)
cc = head.centre + Vector((0, R * 0.02, R * 0.03))
CR = R * 1.09
EDGE_N = Vector((0, 0.24, 1)).normalized()  # the edge's plane: higher at the front, lower at the back
EDGE_P = cc + Vector((0, 0, R * 0.2))
crown = F.dome(cc, CR, EDGE_P, EDGE_N, R * 0.05, cap_m, scale=(1, 1, 0.97), name='cap')
cf = F.surface_finder(crown)


def above_edge(p):
    return (p - EDGE_P).dot(EDGE_N) > R * 0.05


for k6 in range(6):
    phi = k6 * math.pi / 3 + math.pi / 6
    pts = []
    for th in (0.06, 0.3, 0.55, 0.8, 1.05, 1.3):
        p, n = cf(cc, Vector((math.sin(th) * math.sin(phi), -math.sin(th) * math.cos(phi), math.cos(th))))
        if not above_edge(p):
            break
        pts.append(p + n * R * 0.004)
    if len(pts) > 1:
        F.strand(pts, [R * 0.016] * len(pts), seam_m, name='seam')
F.sphere(cf(cc, Vector((0, 0, 1)))[0], (R * 0.09, R * 0.09, R * 0.05), cap_m)
# The brim: a wide rounded tongue from the front edge, out into the air and slightly down, its sides
# curving down a little.
# The brim, New Era style: flat and wide, a rounded rectangle straight out from the bottom of the
# front panel, only a touch of curve across it.
import bmesh  # noqa: E402

# The bottom of the front panel: the lowest point on the crown straight ahead.
fe = None
for th in [1.0 + j * 0.01 for j in range(80)]:
    p, n = cf(cc, Vector((0, -math.sin(th), math.cos(th))))
    if not above_edge(p):
        break
    fe = p
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=1.0, depth=R * 0.035, location=fe)
brim = bpy.context.active_object
brim.scale = (R * 0.86, R * 0.78, 1)
F.bake_transform(brim)
for vtx in brim.data.vertices:
    d = vtx.co - fe
    # A little squarer than an ellipse, and a slight curve down across it.
    if d.y < 0:
        d.x *= 1.0 + 0.12 * (-d.y / (R * 0.78))
    vtx.co = fe + Vector((d.x, d.y, d.z - (d.x / R) ** 2 * R * 0.06 - max(0.0, -d.y) * 0.08))
bm = bmesh.new()
bm.from_mesh(brim.data)
bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=fe + Vector((0, R * 0.04, 0)), plane_no=Vector((0, 1, 0)), clear_outer=True)
bm.to_mesh(brim.data)
bm.free()
bv = brim.modifiers.new('bevel', 'BEVEL')
bv.width = R * 0.014
bv.segments = 3
F.apply_all(brim)
F.shade_smooth(brim)
brim.data.materials.append(cap_m)
# Stitching rows round the brim, like a real one.
stitch = []
for i in range(25):
    t = -math.pi / 2 + i * math.pi / 24
    stitch.append(fe + Vector((math.sin(t) * R * 0.78 * (1.0 + 0.12 * math.cos(t)), -math.cos(t) * R * 0.7, R * 0.019 - (math.sin(t) * 0.78) ** 2 * R * 0.06 - math.cos(t) * R * 0.7 * 0.08)))
F.strand(stitch, [R * 0.007] * len(stitch), seam_m, name='brimstitch')
# The seam where the brim is sewn to the crown: a rolled edge along the crown's front.
rim = []
for az in [i * 0.12 - 0.96 for i in range(17)]:
    d = Vector((math.sin(az), -math.cos(az), 0))
    # Down the crown at this azimuth until just above its edge.
    for th in [0.9 + j * 0.02 for j in range(40)]:
        dv = Vector((math.sin(th) * d.x, math.sin(th) * d.y, math.cos(th)))
        p, n = cf(cc, dv)
        if not above_edge(p):
            break
        last = (p, n)
    rim.append(last[0] + last[1] * R * 0.01)
F.strand(rim, [R * 0.03] * len(rim), cap_m, name='brimseam')

# Pikachu, embroidered on the front panel: everything lies on the cap's surface.
yellow = F.material('pika', '#f6d23a', rough=0.7)
black = F.material('pikablack', '#1c1a18', rough=0.6)
red = F.material('pikared', '#e5483d', rough=0.7)
centre_dir = Vector((0, -1, 0.85)).normalized()
pc, pn = cf(cc, centre_dir)
up = (Vector((0, 0, 1)) - pn * pn.z).normalized()
right = up.cross(pn).normalized()


def on_cap(dx, dy, lift):
    p, n = cf(cc, (pc + right * dx + up * dy - cc).normalized())
    return p + n * lift


face = F.sphere(on_cap(0, 0.0, 0.0), (R * 0.15, R * 0.15, R * 0.15), yellow)
F.bake_transform(face)
fc = on_cap(0, 0.0, 0.0)
for vtx in face.data.vertices:  # pressed flat onto the cap
    d = vtx.co - fc
    vtx.co = fc + d - pn * d.dot(pn) * 0.82 + pn * R * 0.01
F.shade_smooth(face)
for s in (-1, 1):
    F.strand([on_cap(s * 0.12 * R, 0.07 * R, R * 0.01), on_cap(s * 0.2 * R, 0.2 * R, R * 0.01), on_cap(s * 0.24 * R, 0.27 * R, R * 0.01)], [R * 0.04, R * 0.03, R * 0.012], yellow, name='pikaear')
    F.strand([on_cap(s * 0.215 * R, 0.225 * R, R * 0.016), on_cap(s * 0.24 * R, 0.27 * R, R * 0.016)], [R * 0.022, R * 0.012], black, name='pikatip')
    F.sphere(on_cap(s * 0.06 * R, 0.035 * R, R * 0.04), (R * 0.022,) * 3, black)
    F.sphere(on_cap(s * 0.12 * R, -0.04 * R, R * 0.035), (R * 0.03, R * 0.03, R * 0.03), red)
F.strand([on_cap(-0.025 * R, -0.04 * R, R * 0.04), on_cap(0, -0.055 * R, R * 0.042), on_cap(0.025 * R, -0.04 * R, R * 0.04)], [R * 0.007] * 3, black, name='pikamouth')

# ---------- body ----------
k = 0.8
skin = F.material('skin', SKIN, rough=0.42, sss=0.3)
tee = F.fabric(F.material('tee', '#f5f3ee', rough=0.85, sheen=0.6))
fleece = F.fabric(F.material('fleece', '#1d2438', rough=0.95, sheen=0.35), scale=380, strength=0.35)
rib = F.fabric(F.material('rib', '#161c2c', rough=0.95), scale=160, strength=0.4)
shorts = F.fabric(F.material('shorts', '#2a3247', rough=0.85, sheen=0.3), scale=900, strength=0.15)
zip_m = F.material('zip', '#b9bcc2', rough=0.3)
cord = F.material('cord', '#f0ece4', rough=0.7)
sock = F.material('sock', '#f3efe6', rough=0.8)
shoe = F.material('shoe', '#3b4458', rough=0.55)
sole = F.material('sole', '#f3efe6', rough=0.6)


def v(x, y, z):
    return Vector((x * k, y * k, z * k))


SH = 0.5
F.clay([F.capsule(v(0, 0, SH - 0.08), (0, 0, HC.z - R * 0.55), 0.05, 0.045)], 0.005, smooth=8, mat=skin, name='neck')
SHOULDER = {s: v(s * 0.13, 0, SH - 0.06) for s in (-1, 1)}
ELBOW = {s: v(s * 0.19, -0.01, 0.31) for s in (-1, 1)}
WRIST = {s: v(s * 0.205, -0.035, 0.21) for s in (-1, 1)}
# The white T-shirt, showing between the open fronts and below the hoodie's hem.
F.clay([F.sphere(v(0, 0, 0.38), (0.14 * k, 0.12 * k, 0.12 * k)), F.capsule(v(0, 0, 0.3), v(0, 0, 0.42), 0.14 * k)], 0.005, smooth=10, mat=tee, name='tee')
# The hoodie: down to the waist, open at the front.
hoodie = F.clay(
    [
        F.sphere(v(0, 0.005, 0.38), (0.165 * k, 0.135 * k, 0.12 * k)),
        F.sphere(v(0, 0.005, SH - 0.06), (0.17 * k, 0.125 * k, 0.06 * k)),
        F.capsule(v(0, 0.005, 0.29), v(0, 0.005, SH - 0.07), 0.158 * k, 0.15 * k),
        *[F.capsule(SHOULDER[s], ELBOW[s], 0.062 * k, 0.058 * k) for s in (-1, 1)],
        *[F.capsule(ELBOW[s], WRIST[s], 0.058 * k, 0.054 * k) for s in (-1, 1)],
    ],
    0.005,
    smooth=12,
    name='hoodie',
)
cutters = [F.box(v(0, -0.2, 0.37), (0.085 * k, 0.2, 0.4 * k), bevel=0.02), F.box(v(0, 0, 0.14), (0.6, 0.6, 0.24 * k), bevel=0.0)]
for c in cutters:
    m = hoodie.modifiers.new('cut', 'BOOLEAN')
    m.operation = 'DIFFERENCE'
    m.object = c
    m.solver = 'EXACT'
    F.apply_all(hoodie)
    bpy.data.objects.remove(c)
F.shade_smooth(hoodie)
hoodie.data.materials.clear()
hoodie.data.materials.append(fleece)
for poly in hoodie.data.polygons:
    poly.material_index = 0
# A ribbed band round the hem, ribbed cuffs, a zip down each front edge.
hf = F.surface_finder(hoodie)
for s in (-1, 1):
    pts = [hf(v(0, 0, z), Vector((s * 0.3, -1, 0)))[0] for z in (0.29, 0.36, 0.44)]
    F.strand(pts, [0.0045] * 3, zip_m, name='zip')
    along = (WRIST[s] - ELBOW[s]).normalized()
    F.ring(WRIST[s] - along * 0.008, 0.05 * k, 0.012, rib, rot=tuple(Vector((0, 0, 1)).rotation_difference(along).to_euler()), name='cuff')
    F.clay(
        [
            F.sphere(WRIST[s] + v(s * 0.004, -0.006, -0.04), (0.042 * k, 0.034 * k, 0.05 * k)),
            F.capsule(WRIST[s] + v(-s * 0.019, -0.032, -0.018), WRIST[s] + v(-s * 0.023, -0.042, -0.047), 0.016 * k),
        ],
        0.005,
        smooth=8,
        mat=skin,
        name='hand',
    )
    # The hood's drawstrings, hanging down the front.
    top = hf(v(0, 0, SH - 0.02), Vector((s * 0.35, -1, 0.2)))[0]
    F.strand([top, top + Vector((s * 0.002, -0.006, -0.05)), top + Vector((s * 0.004, -0.004, -0.09))], [0.0045, 0.0045, 0.0045], cord, name='cord')
# The hood, lying folded behind the neck.
F.clay([F.sphere(v(0, 0.1, SH + 0.01), (0.13 * k, 0.07 * k, 0.07 * k)), F.ring(v(0, 0.03, SH), 0.085 * k, 0.03, rot=(0.35, 0, 0))], 0.005, smooth=10, mat=fleece, name='hood')
# Shorts to the knee, bare shins, white socks, sneakers.
F.clay([F.sphere(v(0, 0, 0.245), (0.152 * k, 0.127 * k, 0.09 * k))] + [F.capsule(v(s * 0.072, 0, 0.21), v(s * 0.078, -0.01, 0.14), 0.072 * k, 0.068 * k) for s in (-1, 1)], 0.005, smooth=10, mat=shorts, name='shorts')
for s in (-1, 1):
    F.capsule(v(s * 0.078, -0.01, 0.15), v(s * 0.078, -0.015, 0.08), 0.042 * k, 0.038 * k, skin)
    F.tube(v(s * 0.078, -0.015, 0.05), v(s * 0.078, -0.015, 0.1), 0.04 * k, 0.042 * k, 0.006, sock, name='sock')
    F.clay([F.sphere(v(s * 0.078, -0.04, 0.05), (0.06 * k, 0.1 * k, 0.045 * k)), F.sphere(v(s * 0.078, -0.1, 0.04), (0.055 * k, 0.05 * k, 0.035 * k))], 0.004, smooth=8, mat=shoe, name='shoe')
    F.clay([F.sphere(v(s * 0.078, -0.045, 0.02), (0.066 * k, 0.11 * k, 0.022 * k))], 0.004, smooth=6, mat=sole, name='sole')

P.base()
P.previews(out, 0.45, HC.z)
