# Robert as a stylised figurine: a big round head (about a third of his height) with a broad face, big
# blue-grey cartoon eyes under soft lids, a very short buzz cut, a short darker full beard with the
# moustache running into it round the mouth, a closed smile; a cream T-shirt with a hem, collar and
# sleeves, jeans with a waistband, belt and turn-ups, sneakers; on a small wooden diorama base.
#   blender --background --python scripts/blender/robert.py -- out.png
import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(__file__))
import figure_lib as F  # noqa: E402

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.abspath('robert.png')
F.reset()

R = 0.37
HC = Vector((0, 0, 0.9))


def h(x, front, up):
    """A point in head units: x right, `front` towards the viewer, `up` up, from the head's centre."""
    return HC + Vector((x * R, -front * R, up * R))


def dirn(x, front, up):
    return Vector((x, -front, up)).normalized()


# ---------- materials ----------
skin = F.material('skin', '#f2c6a6', rough=0.42, sss=0.3)
HAIR_HEX = '#58402e'
beard_m = F.stubble_material('beard', HAIR_HEX, '#f2c6a6')
brow = F.material('brow', '#4f3627', rough=0.7)
lash = F.material('lash', '#2a1d16', rough=0.5)
eye = F.eye_material('eye', '#6d8a3c', '#34421f', inner_hex='#8a5a30')
shine = F.material('shine', '#ffffff', rough=0.0, emission=8.0)
lips = F.material('lips', '#5e3029', rough=0.5)
lower_lip = F.material('lowerlip', '#d48a7c', rough=0.38, sss=0.3)
shirt = F.fabric(F.material('shirt', '#f1ece2', rough=0.85, sheen=0.8))
ink = F.material('ink', '#2b2a2c', rough=0.8)
shirt_trim = F.fabric(F.material('trim', '#e2d3b6', rough=0.85, sheen=0.7), scale=500, strength=0.25)
jeans = F.fabric(F.material('jeans', '#3c5677', rough=0.8, sheen=0.4), scale=1200, strength=0.18)
jeans_hem = F.material('jeanshem', '#56709a', rough=0.8)
stitch = F.material('stitch', '#d9a23f', rough=0.6)
belt = F.material('belt', '#4a3326', rough=0.45, coat=0.3)
buckle = F.material('buckle', '#c9b07a', rough=0.25)
shoe = F.material('shoe', '#2e3a48', rough=0.55)
sole = F.material('sole', '#f3efe6', rough=0.6)
lace = F.material('lace', '#f3efe6', rough=0.7)
wood = F.fabric(F.material('wood', '#c49a6c', rough=0.65), scale=60, strength=0.08)
base_dark = F.material('base', '#3d3632', rough=0.5, coat=0.4)

# ---------- head ----------
parts = [
    F.sphere(h(0, -0.04, 0.1), (R * 0.97, R * 0.96, R * 1.0)),
    F.sphere(h(0, 0.1, -0.34), (R * 0.82, R * 0.78, R * 0.62)),
    F.sphere(h(0, 0.36, -0.66), (R * 0.3, R * 0.28, R * 0.2)),
    F.sphere(h(0, 0.97, -0.24), (R * 0.1, R * 0.09, R * 0.085)),
]
for s in (-1, 1):
    parts.append(F.sphere(h(s * 0.42, 0.5, -0.28), (R * 0.22,) * 3))
    parts.append(F.sphere(h(s * 0.97, 0.02, -0.14), (R * 0.1, R * 0.15, R * 0.19), rot=(0, 0, s * 0.4)))
head = F.clay(parts, R * 0.018, smooth=12, name='head')

eR = R * 0.27
eyes = [h(s * 0.38, 0.6, -0.1) for s in (-1, 1)]
for c in eyes:
    cut = F.sphere(c, (eR * 1.04,) * 3)
    m = head.modifiers.new('socket', 'BOOLEAN')
    m.operation = 'DIFFERENCE'
    m.object = cut
    m.solver = 'EXACT'
    F.apply_all(head)
    bpy.data.objects.remove(cut)
sm = head.modifiers.new('smooth', 'CORRECTIVE_SMOOTH')
sm.iterations = 4
F.apply_all(head)
F.shade_smooth(head)

# The buzz cut, painted: hair colour above a natural hairline with a soft edge, short sideburns; ears
# and face skin; rosy cheeks.
centre = HC + Vector((0, R * 0.04, R * 0.08))
SKIN = F.lin('#f2c6a6')
HAIR = F.lin(HAIR_HEX)
BLUSH = F.lin('#f4a08f')


HAIRLINE = [(0.0, 0.86), (0.7, 0.92), (1.0, 1.12), (1.15, 1.75), (1.3, 1.75), (1.4, 1.62), (1.62, 1.62), (1.85, 2.1), (2.3, 2.45), (math.pi, 2.55)]


def hairline(a):
    for (a0, t0), (a1, t1) in zip(HAIRLINE, HAIRLINE[1:]):
        if a <= a1:
            return t0 + (t1 - t0) * F.smoothstep(a0, a1, a)
    return HAIRLINE[-1][1]


def head_colour(co):
    v = co - centre
    theta = math.acos(max(-1, min(1, v.z / v.length)))
    a = abs(math.atan2(v.x, -v.y))
    ear = v.length > R * 1.05 and abs(v.x) > R * 0.85
    c = F.mixc(SKIN, HAIR, 0 if ear else F.smoothstep(0.035, -0.035, theta - hairline(a)))
    for s in (-1, 1):
        d = (co - h(s * 0.56, 0.8, -0.38)).length / (R * 0.2)
        c = F.mixc(c, BLUSH, 0.8 * (1 - F.smoothstep(0.3, 1.0, d)))
    return c


def hair_amount(co):
    v = co - centre
    theta = math.acos(max(-1, min(1, v.z / v.length)))
    a = abs(math.atan2(v.x, -v.y))
    ear = v.length > R * 1.05 and abs(v.x) > R * 0.85
    return 0.0 if ear else F.smoothstep(0.035, -0.035, theta - hairline(a))


F.paint(head, head_colour)
F.paint_attr(head, 'hairmask', hair_amount)
head.data.materials.clear()
head.data.materials.append(F.stubbled_painted('headskin', '#f2c6a6', rough=0.42, sss=0.3))

find = F.surface_finder(head)

# Eyes: a ball with the iris drawn on, soft upper and lower lids over its edge, a lash line, catchlights.
for i, c in enumerate(eyes):
    side = -1 if i == 0 else 1
    ball = F.sphere(c, (eR,) * 3, eye, rot=(0, 0, side * 0.1))
    fwd = Vector((side * 0.1, -1, 0)).normalized()
    F.sphere(c + fwd * eR * 0.97 + Vector((side * -0.3 * eR, 0, 0.32 * eR)), (eR * 0.17,) * 3, shine)
    F.sphere(c + fwd * eR * 0.98 + Vector((side * 0.25 * eR, 0, -0.32 * eR)), (eR * 0.07,) * 3, shine)
    F.cap_of_sphere(c, eR * 1.04, lambda p: p.z > eR * 0.5 and p.y < eR * 0.3, skin, thick=R * 0.03, name='lid')
    F.cap_of_sphere(c, eR * 1.03, lambda p: p.z < -eR * 0.82 and p.y < eR * 0.2, skin, thick=R * 0.02, name='lowlid')
    rr = math.sqrt((eR * 1.07) ** 2 - (eR * 0.5) ** 2)
    arc = [c + Vector((side * rr * math.sin(t), -rr * math.cos(t), eR * 0.5)) for t in (-1.3, -0.7, 0, 0.7, 1.3, 1.5)]
    F.strand(arc, [eR * 0.03, eR * 0.06, eR * 0.07, eR * 0.08, eR * 0.09, eR * 0.03], lash, name='lash')
    bp = [find(HC, dirn(side * x, 0.85, up))[0] + dirn(side * x, 0.85, up) * R * 0.03 for x, up in ((0.12, 0.33), (0.32, 0.39), (0.55, 0.31))]
    F.strand(bp, [R * 0.04, R * 0.05, R * 0.03], brow, name='brow')

# A closed smile.
mouth_up = -0.56
mouth = [find(HC, dirn(x, 1, mouth_up + 0.38 * x * x))[0] + dirn(x, 1, 0) * R * 0.004 for x in (-0.26, -0.13, 0, 0.13, 0.26)]
F.strand(mouth, [R * 0.007, R * 0.011, R * 0.012, R * 0.011, R * 0.007], lips, name='smile')
# The lower lip: fuller in the middle, tapering into the corners of the mouth.
lp = []
for x, dip, r in ((-0.26, 0.0, 0.006), (-0.15, 0.045, 0.026), (0, 0.06, 0.034), (0.15, 0.045, 0.026), (0.26, 0.0, 0.006)):
    q, n = find(HC, dirn(x, 1, mouth_up + 0.38 * x * x - dip))
    lp.append((q - n * R * r * 0.35, R * r))
F.strand([q for q, _ in lp], [r for _, r in lp], lower_lip, name='lowerlip')


# The beard, one piece: along the jaw and over the chin, up round the mouth as the moustache; a gap left
# for the lips.
def in_beard(co):
    v = (co - HC).normalized()
    a = abs(math.atan2(v.x, -v.y))
    if a > 1.25:
        return False
    limit = -0.55 + 0.45 * F.smoothstep(0.3, 1.3, a)
    if a < 0.55:
        limit = max(limit, -0.33 - abs(v.x) * 0.35)  # the moustache, under the nose over the upper lip
    lips_gap = (v.x / 0.3) ** 2 + ((v.z + 0.5) / 0.085) ** 2 < 1
    return v.z < limit and not lips_gap


# The moustache: one full curve over the upper lip from corner to corner, running down past the
# corners of the mouth into the beard.
def on_face(x, up, lift=0.0):
    p, n = find(HC, dirn(x, 1, up))
    return p + n * R * lift


must = []
pts = [on_face(-0.4, -0.62, 0.0), on_face(-0.37, -0.46, 0.01), on_face(-0.2, -0.38, 0.015), on_face(0, -0.36, 0.02), on_face(0.2, -0.38, 0.015), on_face(0.37, -0.46, 0.01), on_face(0.4, -0.62, 0.0)]
rad = [0.026, 0.032, 0.036, 0.034, 0.036, 0.032, 0.026]
for (a, b), (ra, rb) in zip(zip(pts, pts[1:]), zip(rad, rad[1:])):
    must.append(F.capsule(a, b, R * ra, R * rb))
F.shell(head, in_beard, R * 0.013, R * 0.012, smooth=16, mat=beard_m, name='beard', extra=must)

# ---------- body ----------
SH = 0.5  # shoulders
F.clay([F.capsule((0, 0, SH - 0.08), (0, 0, HC.z - R * 0.5), 0.062, 0.058)], 0.005, smooth=8, mat=skin, name='neck')
SHOULDER = {s: Vector((s * 0.15, 0, SH - 0.06)) for s in (-1, 1)}
ELBOW = {s: Vector((s * 0.215, -0.01, 0.3)) for s in (-1, 1)}
WRIST = {s: Vector((s * 0.228, -0.035, 0.2)) for s in (-1, 1)}
sleeve_end = {s: SHOULDER[s].lerp(ELBOW[s], 0.62) for s in (-1, 1)}
torso = F.clay(
    [
        F.sphere((0, 0, 0.37), (0.19, 0.15, 0.13)),
        F.sphere((0, 0, SH - 0.06), (0.2, 0.135, 0.06)),
        F.capsule((0, 0, 0.33), (0, 0, SH - 0.07), 0.17),
        *[F.capsule(SHOULDER[s], sleeve_end[s], 0.07, 0.064) for s in (-1, 1)],
    ],
    0.005,
    smooth=14,
    mat=shirt,
    name='shirt',
)
for s_ in (-1, 1):
    along = (ELBOW[s_] - SHOULDER[s_]).normalized()
    F.ring(sleeve_end[s_] - along * 0.006, 0.064, 0.01, shirt, rot=tuple(Vector((0, 0, 1)).rotation_difference(along).to_euler()), name='sleevehem')
# The print: a word across the chest, shrink-wrapped onto the shirt.
bpy.ops.object.text_add(location=(0, -0.2, 0.43), rotation=(math.pi / 2, 0, 0))
txt = bpy.context.active_object
txt.data.body = 'HYGGE'
txt.data.align_x = 'CENTER'
txt.data.size = 0.075
txt.data.extrude = 0.002
txt.data.space_character = 1.05
bpy.context.view_layer.update()
sw = txt.modifiers.new('wrap', 'SHRINKWRAP')
sw.target = torso
sw.wrap_mode = 'OUTSIDE_SURFACE'
sw.offset = 0.002
dg = bpy.context.evaluated_depsgraph_get()
me = bpy.data.meshes.new_from_object(txt.evaluated_get(dg))
tm = bpy.data.objects.new('print', me)
bpy.context.collection.objects.link(tm)
tm.matrix_world = txt.matrix_world
bpy.data.objects.remove(txt)
tm.data.materials.append(ink)
F.ring((0, -0.01, SH + 0.01), 0.07, 0.012, shirt_trim, rot=(0.2, 0, 0), name='collar')
F.ring((0, 0.0, 0.226), 0.152, 0.014, belt, scale=(1.0, 0.86, 1), name='belt')
F.box((0, -0.138, 0.226), (0.042, 0.01, 0.03), buckle, bevel=0.005)
F.clay([F.sphere((0, 0, 0.21), (0.17, 0.135, 0.07))] + [F.capsule((s * 0.08, 0, 0.19), (s * 0.08, -0.01, 0.1), 0.074, 0.068) for s in (-1, 1)], 0.005, smooth=10, mat=jeans, name='jeans')
for s in (-1, 1):
    F.ring((s * 0.08, -0.01, 0.103), 0.068, 0.009, jeans_hem, name='cuff')
    # A sneaker: rounded upper, white sole round it, laces.
    F.clay([F.sphere((s * 0.08, -0.03, 0.06), (0.072, 0.115, 0.055)), F.sphere((s * 0.08, -0.1, 0.045), (0.065, 0.06, 0.04))], 0.005, smooth=8, mat=shoe, name='shoe')
    F.clay([F.sphere((s * 0.08, -0.035, 0.022), (0.078, 0.128, 0.025))], 0.005, smooth=6, mat=sole, name='sole')
    for k in range(3):
        F.strand([(s * 0.08 - 0.03, -0.1 + k * 0.03, 0.093 - k * 0.006), (s * 0.08 + 0.03, -0.1 + k * 0.03, 0.093 - k * 0.006)], [0.006, 0.006], lace, name='lace')
    # Arms hanging a little out, soft mitten hands with a thumb; the sleeve a tube with a hem.
    F.clay(
        [
            # (from inside the sleeve down; the shoulder is the shirt's)
            F.capsule(SHOULDER[s].lerp(ELBOW[s], 0.45), ELBOW[s], 0.05, 0.047),
            F.capsule(ELBOW[s], WRIST[s], 0.047, 0.04),
            F.sphere(WRIST[s] + Vector((s * 0.004, -0.006, -0.042)), (0.046, 0.038, 0.055)),
            F.capsule(WRIST[s] + Vector((-s * 0.02, -0.035, -0.02)), WRIST[s] + Vector((-s * 0.025, -0.045, -0.05)), 0.017),
        ],
        0.005,
        smooth=8,
        mat=skin,
        name='arm',
    )

# ---------- base ----------
F.box((0, 0, -0.055), (1.1, 1.1, 0.11), base_dark, bevel=0.035)
F.box((0, 0, 0.004), (1.06, 1.06, 0.02), wood, bevel=0.008)

F.studio()
F.look((1.15, -3.3, 1.25), (0, 0, 0.6), lens=62)
F.render(out, res=(720, 960), samples=64)
F.look((-1.4, 2.6, 1.3), (0, 0, 0.75), lens=55)
F.render(out.replace('.png', '-back.png'), res=(540, 720), samples=24)
F.look((0.45, -1.6, 1.0), (0, 0, 0.87), lens=70)
F.render(out.replace('.png', '-face.png'), res=(720, 720), samples=64)
