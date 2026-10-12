# The family's heads in an alternative style, after 3dstylereference.png: a soft, slightly tall
# rounded-box head with full cheeks, small dark oval eyes with a pin of light, smooth tapered brows, a
# little button nose and small defined lips, matte warm skin with a touch of blush; hair as smooth
# sculpted masses with a soft painted hairline; a bust in their own clothes, on a flat coloured
# backdrop. Renders a front and a three-quarter view of each.
#   blender --background --python scripts/blender/alt_heads.py -- outdir [names,comma,separated]
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector

sys.path.insert(0, os.path.dirname(__file__))
import figure_lib as F  # noqa: E402
import figure_parts as P  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
outdir = args[0] if args else os.path.abspath('.')

PEOPLE = {
    'robert': dict(skin='#d98d62', hair='#4f3624', bg='#7a9a6b', style='buzz', beard=True, lips='#a85a4e', brow=0.055, lash=False, eye='#2f2616', iris='#6d7a3a'),
    'mette': dict(skin='#e09769', hair='#4e3322', bg='#8a5aa8', style='long', beard=False, lips='#c0414c', brow=0.045, lash=True, eye='#1d2833', iris='#56708a'),
    'pelle': dict(skin='#e29c70', hair='#8a6340', bg='#4f7fb0', style='cap', beard=False, lips='#c26a5e', brow=0.045, lash=False, eye='#2d1a0e', iris='#6b4424'),
    'hjalte': dict(skin='#e8a67c', hair='#c98b52', bg='#e0a35a', style='helmet', beard=False, lips='#d07a70', brow=0.025, lash=False, eye='#1f2b36', iris='#5a7186', baby=True),
}

R = 0.5
C = Vector((0, 0, 1.0))
BOX = (R * 0.86, R * 0.82, R * 1.0)


def hairline_table(style):
    """(angle round from the front, theta down from the top) of the hairline."""
    if style == 'helmet':
        return [(0.0, 0.7), (0.9, 0.9), (1.2, 1.35), (1.6, 1.45), (2.2, 1.85), (math.pi, 2.05)]
    if style == 'buzz':
        return [(0.0, 0.88), (0.7, 0.95), (1.0, 1.15), (1.15, 1.7), (1.3, 1.7), (1.4, 1.5), (1.65, 1.5), (1.9, 1.95), (2.4, 2.2), (math.pi, 2.3)]
    return [(0.0, 0.62), (0.7, 0.7), (1.0, 0.95), (1.15, 1.5), (1.3, 1.5), (1.4, 1.35), (1.65, 1.35), (1.9, 1.85), (2.4, 2.1), (math.pi, 2.2)]


FULL = '--full' in sys.argv
ARM_PARTS = {-1: [], 1: []}


def build_body(name, baby, skin_m):
    """A small soft body in their own clothes under the head, in the same style: rounded shapes, matte.
    The arms are tagged so they can be exported as their own moving parts."""

    def arm(side, sleeve_m, sleeve_to, hand_m):
        S = C + Vector((side * R * (0.5 if baby else 0.6), R * 0.05, -R * (1.15 if baby else 1.2)))
        E = C + Vector((side * R * (0.62 if baby else 0.7), 0, -R * (1.45 if baby else 1.62)))
        W = C + Vector((side * R * (0.55 if baby else 0.72), -R * (0.35 if baby else 0.06), -R * (1.6 if baby else 1.98)))
        before = set(bpy.data.objects)
        r_ = R * (0.13 if baby else 0.15)
        skin_parts = [F.capsule(E, W, r_ * 0.95, r_ * 0.85), F.sphere(W + (W - E).normalized() * r_ * 0.6, (r_ * 1.0,) * 3)]
        if sleeve_to == 'wrist':
            cloth = [F.capsule(S, E, r_ * 1.12, r_ * 1.05), F.capsule(E, W.lerp(E, 0.15), r_ * 1.05, r_ * 1.0)]
        else:
            cloth = [F.capsule(S, S.lerp(E, 0.75), r_ * 1.15, r_ * 1.1)]
        F.clay(skin_parts + ([F.capsule(S, E, r_ * 0.95, r_ * 0.95)] if sleeve_to != 'wrist' else []), R * 0.012, smooth=8, mat=hand_m, name='armskin')
        F.clay(cloth, R * 0.012, smooth=8, mat=sleeve_m, name='sleeve')
        ARM_PARTS[side] = [o for o in bpy.data.objects if o not in before]
        ARM_PARTS[side + 10] = S

    neck_top, neck_bot = C + Vector((0, R * 0.05, -R * 0.7)), C + Vector((0, R * 0.05, -R * (1.0 if baby else 1.1)))
    F.clay([F.capsule(neck_top, neck_bot, R * 0.22, R * 0.24)], R * 0.012, smooth=8, mat=skin_m, name='neck')

    if name == 'hjalte':
        suit = P.spotted('suit', '#b39572', '#3a2a1f', scale=12.0)
        sandal = F.material('sandal', '#8a5a3a', rough=0.7)
        torso = F.sphere(C + Vector((0, R * 0.05, -R * 1.45)), (R, R, R))
        F.bake_transform(torso)
        F.boxy(torso, C + Vector((0, R * 0.05, -R * 1.45)), (R * 0.55, R * 0.45, R * 0.48), p=2.3)
        legs = []
        for s in (-1, 1):
            legs.append(F.capsule(C + Vector((s * R * 0.24, -R * 0.05, -R * 1.78)), C + Vector((s * R * 0.32, -R * 0.62, -R * 1.85)), R * 0.2, R * 0.17))
        F.clay([torso] + legs, R * 0.014, smooth=10, mat=suit, name='suit')
        F.ring(C + Vector((0, R * 0.04, -R * 1.0)), R * 0.25, R * 0.04, suit, scale=(1, 0.85, 1), rot=(0.15, 0, 0), name='collar')
        for s in (-1, 1):
            foot = C + Vector((s * R * 0.33, -R * 0.78, -R * 1.78))
            F.sphere(foot, (R * 0.13, R * 0.1, R * 0.16), skin_m)
            F.box(foot + Vector((0, -R * 0.1, 0)), (R * 0.24, R * 0.04, R * 0.32), sandal, bevel=R * 0.015)
            F.ring(foot + Vector((0, -R * 0.02, R * 0.04)), R * 0.12, R * 0.022, sandal, rot=(math.pi / 2, 0, 0), name='strap')
            arm(s, suit, 'wrist', skin_m)
        return 'baby'

    if name == 'robert':
        top_m = F.material('tee', '#f1ece2', rough=0.85)
        bottom_m = F.material('jeans', '#3c5677', rough=0.85)
        shoe_m = F.material('shoe', '#2e3a48', rough=0.7)
        sleeve_to = 'short'
    elif name == 'mette':
        top_m = P.floral('blouse', '#eee6da', ['#c98f86', '#93a883'], scale=14)
        bottom_m = F.material('trousers', '#25262b', rough=0.85)
        shoe_m = F.material('flats', '#cfae8e', rough=0.7)
        sleeve_to = 'wrist'
    else:
        top_m = F.material('fleece', '#1d2438', rough=0.95)
        bottom_m = F.material('shorts', '#2a3247', rough=0.9)
        shoe_m = F.material('shoe', '#3b4458', rough=0.7)
        sleeve_to = 'wrist'
    sole_m = F.material('sole', '#f3efe6', rough=0.8)

    tc = C + Vector((0, R * 0.05, -R * 1.5))
    torso = F.sphere(tc, (R, R, R))
    F.bake_transform(torso)
    F.boxy(torso, tc, (R * 0.6, R * 0.42, R * 0.52), p=2.6)
    F.clay([torso], R * 0.014, smooth=8, mat=top_m, name='top')
    F.ring(C + Vector((0, R * 0.04, -R * 1.02)), R * 0.27, R * 0.045, top_m, scale=(1, 0.85, 1), rot=(0.15, 0, 0), name='collar')
    hc = C + Vector((0, R * 0.05, -R * 1.98))
    hips = F.sphere(hc, (R, R, R))
    F.bake_transform(hips)
    F.boxy(hips, hc, (R * 0.55, R * 0.4, R * 0.2), p=2.6)
    short_legs = name == 'pelle'
    legs = [hips]
    for s in (-1, 1):
        legs.append(F.capsule(C + Vector((s * R * 0.25, R * 0.05, -R * 2.0)), C + Vector((s * R * 0.26, R * 0.05, -R * (2.3 if short_legs else 2.6))), R * 0.2, R * 0.19))
    F.clay(legs, R * 0.014, smooth=10, mat=bottom_m, name='bottom')
    for s in (-1, 1):
        if short_legs:
            F.capsule(C + Vector((s * R * 0.26, R * 0.05, -R * 2.3)), C + Vector((s * R * 0.26, R * 0.05, -R * 2.62)), R * 0.14, R * 0.13, skin_m)
            F.capsule(C + Vector((s * R * 0.26, R * 0.05, -R * 2.55)), C + Vector((s * R * 0.26, R * 0.05, -R * 2.66)), R * 0.15, R * 0.15, F.material('sock', '#f3efe6', rough=0.9))
        shoe = F.sphere(C + Vector((s * R * 0.26, -R * 0.06, -R * 2.72)), (R, R, R))
        F.bake_transform(shoe)
        F.boxy(shoe, C + Vector((s * R * 0.26, -R * 0.06, -R * 2.72)), (R * 0.2, R * 0.3, R * 0.12), p=2.4)
        shoe.data.materials.append(shoe_m)
        F.shade_smooth(shoe)
        F.box(C + Vector((s * R * 0.26, -R * 0.06, -R * 2.81)), (R * 0.38, R * 0.56, R * 0.06), sole_m if name != 'mette' else shoe_m, bevel=R * 0.025)
        arm(s, top_m, sleeve_to, skin_m)
    if name == 'robert':
        F.ring(C + Vector((0, R * 0.05, -R * 1.9)), R * 0.53, R * 0.035, F.material('belt', '#4a3326', rough=0.7), scale=(1, 0.76, 1), name='belt')
    if name == 'pelle':
        # The open hoodie: the white T-shirt down the front, the hood behind the neck, drawstrings.
        bf = F.surface_finder(bpy.data.objects['top'])
        pts = [bf(C + Vector((0, 0, -R * z)), Vector((0, -1, 0)))[0] for z in (1.12, 1.4, 1.75, 1.95)]
        F.strand(pts, [R * 0.13, R * 0.13, R * 0.12, R * 0.1], F.material('teewhite', '#f5f3ee', rough=0.85), name='tee')
        F.ring(C + Vector((0, R * 0.2, -R * 1.02)), R * 0.32, R * 0.08, top_m, scale=(1, 0.8, 1), rot=(0.35, 0, 0), name='hood')
        for s in (-1, 1):
            F.strand([C + Vector((s * R * 0.13, -R * 0.36, -R * 1.12)), C + Vector((s * R * 0.14, -R * 0.42, -R * 1.42))], [R * 0.014] * 2, F.material('cord', '#f0ece4', rough=0.7), name='cord')
    return 'adult'


EXPORT = '--export' in sys.argv


def export(name, floor_z, out_dir):
    """The figure as a light GLB for the people view: its parts grouped and named so the card can move
    them (head turns and nods, eyes blink, arms wave), feet at the origin, facing +Z in glTF."""
    os.makedirs(out_dir, exist_ok=True)
    for o in list(bpy.data.objects):
        if o.type != 'MESH' or o.name.startswith('base') or not o.data.polygons:
            if o.type != 'MESH' or o.name.startswith('base'):
                bpy.data.objects.remove(o)
            continue
    # Printed fabrics (a flowered blouse, a cheetah suit) are patterns made in the shader; GLB can't
    # carry those, so they are baked into a texture on the piece.
    scn = bpy.context.scene
    scn.render.engine = 'CYCLES'
    scn.cycles.samples = 4
    for o in [o for o in bpy.data.objects if o.type == 'MESH' and any(m and m.name.split('.')[0] in ('blouse', 'suit') for m in o.data.materials)]:
        bpy.ops.object.select_all(action='DESELECT')
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(island_margin=0.01)
        bpy.ops.object.mode_set(mode='OBJECT')
        # Its own copy of the material and its own image (pieces sharing one would overwrite each other).
        mat = o.data.materials[0].copy()
        o.data.materials[0] = mat
        img = bpy.data.images.new(o.name + '_tex', 1024, 1024)
        nt = mat.node_tree
        node = nt.nodes.new('ShaderNodeTexImage')
        node.image = img
        nt.nodes.active = node
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR'}, use_clear=True, margin=4)
        img.pack()
        nt.links.new(node.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])
        # The bump from the fabric noise isn't wanted on the export.
        b = nt.nodes['Principled BSDF']
        for l in list(b.inputs['Normal'].links):
            nt.links.remove(l)
    neck_z = C.z - R * 0.72
    arms = {s: set(ARM_PARTS.get(s, [])) for s in (-1, 1)}
    groups = {'head': [], 'body': [], 'arm_l': [], 'arm_r': [], 'eye_l': [], 'eye_r': []}
    for o in bpy.data.objects:
        if o.type != 'MESH':
            continue
        c = sum((o.matrix_world @ v.co for v in o.data.vertices), Vector()) / max(1, len(o.data.vertices))
        if o in arms[1]:
            groups['arm_l'].append(o)  # the figure's left (it faces -Y in Blender, +X is its left)
        elif o in arms[-1]:
            groups['arm_r'].append(o)
        elif o.name.startswith('eye'):
            groups['eye_l' if c.x > 0 else 'eye_r'].append(o)
        elif c.z > neck_z:
            groups['head'].append(o)
        else:
            groups['body'].append(o)
    targets = {'head': 9000, 'body': 3500, 'arm_l': 700, 'arm_r': 700, 'eye_l': 120, 'eye_r': 120}
    pivots = {
        'head': C + Vector((0, R * 0.05, -R * 0.75)),
        'arm_l': ARM_PARTS.get(11, C),
        'arm_r': ARM_PARTS.get(9, C),
    }
    joined = {}
    for key, objs in groups.items():
        if not objs:
            continue
        for o in objs:
            F.apply_all(o)
            F.bake_transform(o)
        o = F.join(objs, keep=True) if len(objs) > 1 else objs[0]
        # join() clears materials when given one; keep them: rejoin without clearing.
        o.name = key
        tris = sum(len(p.vertices) - 2 for p in o.data.polygons)
        if tris > targets[key]:
            d = o.modifiers.new('decimate', 'DECIMATE')
            d.ratio = targets[key] / tris
            F.apply_all(o)
        F.shade_smooth(o)
        # Origin at the part's pivot (eyes: their own centre, so they can be squashed to blink).
        if key.startswith('eye'):
            pv = sum((v.co for v in o.data.vertices), Vector()) / len(o.data.vertices)
        else:
            pv = pivots.get(key, Vector((0, 0, floor_z)))
        o.data.transform(Matrix.Translation(-pv))
        o.location = pv - Vector((0, 0, floor_z))
        joined[key] = o
    for key in ('eye_l', 'eye_r'):
        if key in joined and 'head' in joined:
            e = joined[key]
            h = joined['head']
            loc = e.location.copy()
            e.parent = h
            e.location = loc - h.location
    bpy.ops.object.select_all(action='DESELECT')
    path = os.path.join(out_dir, f'{name}.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_yup=True, export_apply=True, export_lights=False, export_cameras=False)
    print('EXPORTED', path, {k: sum(len(p.vertices) - 2 for p in o.data.polygons) for k, o in joined.items()})


def build(name, Pp):
    F.reset()
    skin_hex = Pp['skin']
    hair_m = F.material('hair', Pp['hair'], rough=0.9)
    dark = F.material('eye', '#2a1a12', rough=0.9)
    shine = F.material('shine', '#fbf8f2', rough=0.8)
    brow_m = F.material('brow', Pp['hair'] if name != 'hjalte' else '#a8743f', rough=0.6)
    lip_m = F.material('lips', Pp['lips'], rough=0.7)
    lash_m = F.material('lash', '#1a1410', rough=0.5)
    skin_m = F.material('skin', skin_hex, rough=0.75)

    # ---------- head ----------
    # A sphere pushed out to a soft rounded box, fuller at the cheeks and jaw.
    bpy.ops.mesh.primitive_uv_sphere_add(segments=160, ring_count=80, location=C)
    head = bpy.context.active_object
    head.scale = (R, R, R)
    F.bake_transform(head)
    baby = Pp.get('baby', False)
    F.boxy(head, C, (R * 0.95, R * 0.9, R * 0.95) if baby else BOX, p=2.15 if baby else 2.5)
    for v in head.data.vertices:
        d = v.co - C
        # Fuller lower face: widen it a little below the eyes, round the chin.
        if d.z < 0:
            t = min(1.0, -d.z / R)
            k = 0.11 if baby else 0.05
            v.co.x *= 1.0 + k * math.sin(t * math.pi * 0.8)
            v.co.y = C.y + d.y * (1.0 + k * 0.8 * math.sin(t * math.pi * 0.8))
    # The nose: a soft rise in the face itself, its bridge melting up into the brow, the tip rounder.
    nk = 0.75 if baby else 1.0
    tip = C + Vector((0, -R * 0.82, -R * (0.3 if baby else 0.2)))
    for v in head.data.vertices:
        d = v.co - tip
        if v.co.y > C.y:
            continue
        dx = d.x / (R * 0.075 * nk)
        dz_tip = d.z / (R * 0.07 * nk)
        dz_bridge = (d.z - R * 0.12) / (R * 0.16)
        bump = math.exp(-(dx * dx + dz_tip * dz_tip)) * R * 0.1 * nk + math.exp(-((d.x / (R * 0.055)) ** 2 + dz_bridge ** 2)) * R * 0.035 * nk
        if bump > 1e-5:
            v.co.y -= bump
    head.data.update()
    find = F.surface_finder(head)

    def face(x, z, lift=0.0):
        p, n = find(C + Vector((x * R, 0, z * R)), Vector((0, -1, 0)))
        return p + n * lift * R, n

    def angles(co):
        d = co - C
        theta = math.acos(max(-1, min(1, d.z / d.length)))
        return theta, abs(math.atan2(d.x, -d.y))

    table = hairline_table(Pp['style'])

    def line(a):
        for (a0, t0), (a1, t1) in zip(table, table[1:]):
            if a <= a1:
                return t0 + (t1 - t0) * F.smoothstep(a0, a1, a)
        return table[-1][1]

    def hair_amount(co):
        theta, a = angles(co)
        d = co - C
        ear = min((co - (C + Vector((sx * R * 0.86, R * 0.06, -R * 0.12)))).length for sx in (-1, 1)) / (R * 0.2)
        return F.smoothstep(0.04, -0.04, theta - line(a)) * F.smoothstep(0.8, 1.15, ear)

    def beard_amount(co):
        if not Pp['beard']:
            return 0.0
        d = co - C
        v = d.normalized()
        a = abs(math.atan2(v.x, -v.y))
        if d.y > -R * 0.05:
            return 0.0
        limit = -0.42 + 0.42 * F.smoothstep(0.3, 1.35, a)
        if a < 0.55:
            limit = max(limit, -0.3 - abs(v.x) * 0.3)
        f = F.smoothstep(0.03, -0.03, v.z - limit) * F.smoothstep(1.4, 1.25, a)
        lips = (v.x / 0.2) ** 2 + ((v.z + 0.43) / 0.075) ** 2
        return f * F.smoothstep(0.8, 1.2, lips)

    SK = F.lin(skin_hex)
    HA = F.lin(Pp['hair'])
    BL = F.lin('#ee7f70')

    def colour(co):
        c = SK
        if False:
            c = F.mixc(c, HA, hair_amount(co) * (0.92 if Pp['style'] == 'buzz' else 1.0))

        for s in (-1, 1):
            d = (co - (C + Vector((s * R * 0.52, -R * 0.78, -R * (0.34 if Pp.get('baby') else 0.24))))).length / (R * (0.22 if Pp.get('baby') else 0.17))
            c = F.mixc(c, BL, 0.55 * (1 - F.smoothstep(0.2, 1.0, d)))
        return c

    F.paint(head, colour)
    head.data.materials.clear()
    if Pp['style'] == 'buzz':
        head.data.materials.append(F.painted('headskin', rough=0.75, sss=0.0))
    else:
        head.data.materials.append(F.painted('headskin', rough=0.75, sss=0.0))
    F.shade_smooth(head)

    # Small ears.
    for s in (-1, 1):
        F.clay([F.sphere(C + Vector((s * R * 0.86, R * 0.06, -R * 0.12)), (R * 0.08, R * 0.11, R * 0.15))], R * 0.012, smooth=6, mat=skin_m, name='ear')

    # ---------- face ----------
    for s in (-1, 1):
        ek = 1.25 if baby else 1.0
        p, n = face(s * (0.37 if baby else 0.35), -0.14 if baby else -0.02)
        # The eye: flat ovals lying on the skin, as if drawn on: dark, a ring of colour, a pupil.
        flat = R * 0.006
        # A thick oval disc with a rounded edge, standing on the skin.
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=1.0, depth=1.0)
        disc = bpy.context.active_object
        disc.scale = (R * 0.078 * ek, R * 0.098 * ek, R * 0.035)
        disc.rotation_mode = 'QUATERNION'
        disc.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(n) @ Vector((0, 0, 1)).rotation_difference(Vector((0, 0, 1)))
        F.bake_transform(disc)
        # Its long axis upright: the cylinder's y became the face's up after aligning z to the normal.
        disc.location = p + n * R * 0.008
        bv = disc.modifiers.new('bevel', 'BEVEL')
        bv.width = R * 0.014
        bv.segments = 4
        F.apply_all(disc)
        F.shade_smooth(disc)
        disc.data.materials.append(dark)
        disc.name = 'eye'
        long_ = 1.0 if Pp['lash'] else 0.65
        for t in ((0.35, 0.75, 1.1) if Pp['lash'] else (0.6, 1.0)):
            b = p + n * R * 0.03 + Vector((s * math.sin(t) * R * 0.078 * ek, 0, math.cos(t) * R * 0.098 * ek))
            F.strand([b, b + Vector((s * R * 0.045 * long_, -R * 0.015, R * 0.032 * long_))], [R * 0.011, R * 0.003], lash_m, name='lash')
        # Brows: smooth tapered arcs, thicker towards the nose.
        bz = 0.12 if baby else 0.22
        bw = Pp['brow'] * 1.15
        pts = [face(s * x, z, 0.015)[0] for x, z in ((0.15, bz - 0.01), (0.27, bz + 0.05), (0.4, bz + 0.065), (0.53, bz + 0.02))]
        brow = F.strand(pts, [R * bw, R * bw * 0.95, R * bw * 0.75, R * bw * 0.3], brow_m, name='brow')
        # Flattened against the skin, like a plate.
        for v in brow.data.vertices:
            q, qn = find(C, (v.co - C).normalized())
            depth = (v.co - q).dot(qn)
            v.co -= qn * (depth - R * 0.012) * 0.6

    # Lips: a small upper lip with a dip in the middle, a fuller lower lip.
    mz = -0.5 if baby else -0.43
    mk = 0.65 if baby else 1.0
    p, n = face(0, mz)
    F.clay([F.sphere(p + n * R * 0.008 + Vector((0, 0, -R * 0.028 * mk)), (R * 0.08 * mk, R * 0.032 * mk, R * 0.032 * mk))] + [F.sphere(p + n * R * 0.008 + Vector((s * R * 0.032 * mk, 0, R * 0.012 * mk)), (R * 0.048 * mk, R * 0.028 * mk, R * 0.026 * mk)) for s in (-1, 1)], R * 0.006, smooth=6, mat=lip_m, name='lips')
    F.strand([face(x * mk, mz + abs(x) * 0.15 - 0.005, 0.03)[0] for x in (-0.08, 0, 0.08)], [R * 0.006] * 3, F.material('crease', '#6b2a28', rough=0.7), name='crease')

    # ---------- hair ----------
    style = Pp['style']
    def short_hair(forehead=0.72):
        region = F.slab(C + Vector((0, 0, R * 0.04)), (0, 0.8, 1))
        brow = F.sphere(C + Vector((0, -R * 0.95, R * (forehead - 0.72))), (R * 0.78, R * 0.62, R * 0.72))
        m = region.modifiers.new('forehead', 'BOOLEAN')
        m.operation = 'DIFFERENCE'
        m.object = brow
        m.solver = 'EXACT'
        F.apply_all(region)
        bpy.data.objects.remove(brow)
        return region

    def ears_cut(r=0.2):
        return [F.sphere(C + Vector((sx * R * 0.86, R * 0.06, -R * 0.12)), (R * r, R * r * 1.1, R * r * 1.25)) for sx in (-1, 1)]

    if Pp['beard']:
        # A short full beard: a layer round the jaw and chin, up into the sideburns in front of the
        # ears, the moustache over the upper lip joining it at the corners of the mouth; the lips clear.
        jaw = F.sphere(C + Vector((0, -R * 0.1, -R * 0.8)), (R * 1.0, R * 0.95, R * 0.82))
        parts = [jaw]
        for sx in (-1, 1):
            parts.append(F.capsule(C + Vector((sx * R * 0.86, -R * 0.02, R * 0.08)), C + Vector((sx * R * 0.8, -R * 0.25, -R * 0.45)), R * 0.11, R * 0.16))
        mp_, _ = face(0, -0.4)
        parts.append(F.capsule(mp_ + Vector((-R * 0.22, R * 0.06, -R * 0.03)), mp_ + Vector((R * 0.22, R * 0.06, -R * 0.03)), R * 0.05, R * 0.05))
        region = F.clay(parts, R * 0.03, smooth=4, name='beardregion')
        lp, _ = face(0, -0.45)
        mouth = F.sphere(lp, (R * 0.14, R * 0.2, R * 0.055))
        F.layer(head, R * 0.035, region, cut=[mouth, F.slab(C + Vector((0, R * 0.08, 0)), (0, 1, 0))] + ears_cut(0.17), mat=F.material('beard', '#3d281a', rough=0.95), name='beard')
    if style == 'buzz':
        # Clipper-short hair: a thin layer above a hairline across the forehead, over the ears, down to
        # the nape; ears left clear.
        F.layer(head, R * 0.025, short_hair(0.72), cut=ears_cut(0.16), mat=F.material('buzz', Pp['hair'], rough=0.95), name='hair')
    if style == 'long':
        # Long hair as the reference builds it, from a few big soft plates: a thick rounded cap over the
        # head (standing well off it, wider than the face at the sides), a broad slab of hair behind
        # falling past the neck to the shoulders, its front edges showing beside the face; and two thick
        # curtain-bang plates from the middle parting curving down over the forehead to frame the face.
        def cut_away(obj, cutter):
            m = obj.modifiers.new('cut', 'BOOLEAN')
            m.operation = 'DIFFERENCE'
            m.object = cutter
            m.solver = 'EXACT'
            F.apply_all(obj)
            bpy.data.objects.remove(cutter)

        # The whole hair as one smooth, convex shape (the cap over the head and the fall behind it to the
        # shoulders, wrapped as one: no dips where they meet), then cut: the face's window as a pointed arch
        # from the parting, a window for the neck, a flat bottom; every cut edge rounded.
        import bmesh

        def blob(centre, radii, p_):
            bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, location=centre)
            o = bpy.context.active_object
            o.scale = (R, R, R)
            F.bake_transform(o)
            F.boxy(o, centre, radii, p=p_)
            return o

        cap = blob(C + Vector((0, R * 0.06, R * 0.04)), (R * 1.04, R * 1.0, R * 1.08), 2.4)
        back = blob(C + Vector((0, R * 0.2, -R * 0.5)), (R * 1.07, R * 0.9, R * 1.0), 3.0)
        hair_mass = F.join([cap, back])
        bm = bmesh.new()
        bm.from_mesh(hair_mass.data)
        bmesh.ops.convex_hull(bm, input=bm.verts[:])
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.to_mesh(hair_mass.data)
        bm.free()
        hair_mass = F.clay(hair_mass, R * 0.015, smooth=25, name='hair')

        outline = [(0, 0.66), (0.3, 0.42), (0.6, 0.2), (0.8, -0.05), (0.8, -1.8), (-0.8, -1.8), (-0.8, -0.05), (-0.6, 0.2), (-0.3, 0.42)]
        bm = bmesh.new()
        front_v = [bm.verts.new(C + Vector((x * R, -R * 2.0, z * R))) for x, z in outline]
        back_v = [bm.verts.new(C + Vector((x * R, -R * 0.15, z * R))) for x, z in outline]
        bm.faces.new(front_v)
        bm.faces.new(list(reversed(back_v)))
        for i in range(len(outline)):
            j = (i + 1) % len(outline)
            bm.faces.new((front_v[i], front_v[j], back_v[j], back_v[i]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        wme = bpy.data.meshes.new('window')
        bm.to_mesh(wme)
        bm.free()
        window = bpy.data.objects.new('window', wme)
        bpy.context.collection.objects.link(window)
        cut_away(hair_mass, window)
        cut_away(hair_mass, F.box(C + Vector((0, -R * 0.62, -R * 1.0)), (R * 1.56, R * 1.4, R * 1.2), None, bevel=0))
        cut_away(hair_mass, F.slab(C + Vector((0, 0, -R * 1.3)), (0, 0, -1)))
        # The parting: a clean narrow groove down the middle from the peak back over the crown, cut only
        # into the surface (a thin slice of everything outside a slightly shrunk copy of the hair).
        bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=R * 2.0, depth=R * 0.035, location=C, rotation=(0, math.pi / 2, 0))
        slice_ = bpy.context.active_object
        F.bake_transform(slice_)
        inner = bpy.data.objects.new('inner', hair_mass.data.copy())
        bpy.context.collection.objects.link(inner)
        inner.data.transform(Matrix.Translation(C) @ Matrix.Scale(0.93, 4) @ Matrix.Translation(-C))
        cut_away(slice_, inner)
        for keep_ in (F.slab(C + Vector((0, R * 0.1, 0)), (0, -1, 0)), F.slab(C + Vector((0, 0, R * 0.2)), (0, 0, 1))):
            m = slice_.modifiers.new('k', 'BOOLEAN')
            m.operation = 'INTERSECT'
            m.object = keep_
            m.solver = 'EXACT'
            F.apply_all(slice_)
            bpy.data.objects.remove(keep_)
        cut_away(hair_mass, slice_)
        bv = hair_mass.modifiers.new('bevel', 'BEVEL')
        bv.width = R * 0.07
        bv.segments = 5
        bv.limit_method = 'ANGLE'
        bv.angle_limit = 0.5
        F.apply_all(hair_mass)
        F.shade_smooth(hair_mass)
        hair_mass.data.materials.clear()
        hair_mass.data.materials.append(hair_m)
        cf = F.surface_finder(hair_mass)

        hair = None
    elif style == 'cap':
        F.layer(head, R * 0.025, short_hair(0.6), cut=ears_cut(0.16), mat=hair_m, name='hair')
        # Short hair showing under a cream cap: a crown fitting the head, six seams, a button, a flat
        # brim; Pikachu on the front.
        cap_m = F.fabric(F.material('cap', '#efe7d4', rough=0.8, sheen=0.4), scale=400, strength=0.12)
        seam_m = F.material('seam', '#cbbf9f', rough=0.8)
        cc = C + Vector((0, R * 0.02, R * 0.04))
        EN = Vector((0, 0.24, 1)).normalized()
        EP = cc + Vector((0, 0, R * 0.26))
        crown = F.dome(cc, R * 1.0, EP, EN, R * 0.05, cap_m, name='cap', box=((R * 0.92, R * 0.88, R * 1.04), 2.5))
        cf = F.surface_finder(crown)
        for k in range(6):
            phi = k * math.pi / 3 + math.pi / 6
            pts = []
            for th in (0.06, 0.35, 0.65, 0.95):
                q, qn = cf(cc, Vector((math.sin(th) * math.sin(phi), -math.sin(th) * math.cos(phi), math.cos(th))))
                if (q - EP).dot(EN) < R * 0.05:
                    break
                pts.append(q + qn * R * 0.004)
            if len(pts) > 1:
                F.strand(pts, [R * 0.012] * len(pts), seam_m, name='seam')
        F.sphere(cf(cc, Vector((0, 0, 1)))[0], (R * 0.07, R * 0.07, R * 0.04), cap_m)
        fe = None
        for th in [0.9 + j * 0.01 for j in range(90)]:
            q, _ = cf(cc, Vector((0, -math.sin(th), math.cos(th))))
            if (q - EP).dot(EN) < R * 0.02:
                break
            fe = q
        bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=1.0, depth=R * 0.035, location=fe)
        brim = bpy.context.active_object
        brim.scale = (R * 0.72, R * 0.55, 1)
        F.bake_transform(brim)
        for v in brim.data.vertices:
            d = v.co - fe
            v.co.z -= (d.x / R) ** 2 * R * 0.12 + max(0.0, -d.y) * 0.1
        import bmesh

        bm = bmesh.new()
        bm.from_mesh(brim.data)
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=fe + Vector((0, R * 0.03, 0)), plane_no=Vector((0, 1, 0)), clear_outer=True)
        bm.to_mesh(brim.data)
        bm.free()
        bv = brim.modifiers.new('bevel', 'BEVEL')
        bv.width = R * 0.012
        bv.segments = 3
        F.apply_all(brim)
        F.shade_smooth(brim)
        brim.data.materials.append(cap_m)
        # Pikachu, flat on the front panel.
        pc, pn = cf(cc, Vector((0, -1, 0.75)).normalized())
        up = (Vector((0, 0, 1)) - pn * pn.z).normalized()
        rt = up.cross(pn).normalized()
        yel = F.material('pika', '#f6d23a', rough=0.6)
        blk = F.material('pikablack', '#1c1a18', rough=0.5)
        red = F.material('pikared', '#e5483d', rough=0.6)
        fc = F.sphere(pc, (R * 0.13,) * 3, yel)
        F.bake_transform(fc)
        for v in fc.data.vertices:
            d = v.co - pc
            v.co = pc + d - pn * d.dot(pn) * 0.82 + pn * R * 0.01
        F.shade_smooth(fc)
        for s in (-1, 1):
            eb = pc + rt * s * R * 0.08 + up * R * 0.07 + pn * R * 0.02
            et = eb + rt * s * R * 0.09 + up * R * 0.13
            F.capsule(eb, et, R * 0.03, R * 0.012, yel)
            F.sphere(et, (R * 0.016,) * 3, blk)
            F.sphere(pc + rt * s * R * 0.045 + up * R * 0.02 + pn * R * 0.035, (R * 0.016,) * 3, blk)
            F.sphere(pc + rt * s * R * 0.08 - up * R * 0.035 + pn * R * 0.032, (R * 0.022,) * 3, red)
    elif style == 'helmet':
        F.layer(head, R * 0.02, short_hair(0.5), cut=ears_cut(0.16), mat=hair_m, name='hair')
        # Fine baby hair under a glossy yellow hard hat with three ridges and a brim.
        hat = F.material('hat', '#f5a400', rough=0.6)
        hc = C + Vector((0, 0, R * 0.2))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, location=hc)
        dome = bpy.context.active_object
        dome.scale = (R, R, R)
        F.bake_transform(dome)
        F.boxy(dome, hc, (R * 1.0, R * 0.97, R * 1.0), p=2.2)
        keep = F.slab(hc, (0, 0, 1))
        m = dome.modifiers.new('k', 'BOOLEAN')
        m.operation = 'INTERSECT'
        m.object = keep
        m.solver = 'EXACT'
        F.apply_all(dome)
        bpy.data.objects.remove(keep)
        bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=1.0, depth=R * 0.06, location=hc + Vector((0, -R * 0.1, R * 0.02)))
        brim = bpy.context.active_object
        brim.scale = (R * 1.18, R * 1.26, 1)
        F.bake_transform(brim)
        helmet = F.clay([dome, brim], R * 0.012, smooth=10, mat=hat, name='helmet')
        hf = F.surface_finder(helmet)
        for x in (-0.3, 0.0, 0.3):
            pts = []
            for t in (-1.2, -0.7, -0.2, 0.3, 0.8, 1.25):
                q, qn = hf(hc, Vector((x, math.sin(t), math.cos(t))))
                pts.append(q)
            F.strand(pts, [R * (0.04 if x == 0 else 0.028)] * len(pts), hat, name='ridge')

    # ---------- bust or full body ----------
    if FULL:
        build_body(name, baby, skin_m)
    elif baby:
        F.clay([F.capsule(C + Vector((0, R * 0.05, -R * 0.7)), C + Vector((0, R * 0.08, -R * 1.0)), R * 0.28, R * 0.3)], R * 0.012, smooth=8, mat=skin_m, name='neck')
        body = [F.sphere(C + Vector((0, R * 0.1, -R * 1.35)), (R * 0.78, R * 0.5, R * 0.36)), F.capsule(C + Vector((-R * 0.48, R * 0.1, -R * 1.25)), C + Vector((R * 0.48, R * 0.1, -R * 1.25)), R * 0.26)]
    else:
        F.clay([F.capsule(C + Vector((0, R * 0.05, -R * 0.7)), C + Vector((0, R * 0.08, -R * 1.3)), R * 0.26, R * 0.3)], R * 0.012, smooth=8, mat=skin_m, name='neck')
        body = [F.sphere(C + Vector((0, R * 0.1, -R * 1.62)), (R * 1.0, R * 0.52, R * 0.42)), F.capsule(C + Vector((-R * 0.62, R * 0.1, -R * 1.5)), C + Vector((R * 0.62, R * 0.1, -R * 1.5)), R * 0.3)]
    if FULL:
        pass
    elif name == 'robert':
        cloth = F.fabric(F.material('tee', '#f1ece2', rough=0.85, sheen=0.6))
        F.clay(body, R * 0.012, smooth=10, mat=cloth, name='tee')
        F.ring(C + Vector((0, R * 0.03, -R * 1.22)), R * 0.3, R * 0.03, cloth, scale=(1, 0.85, 1), rot=(0.2, 0, 0), name='collar')
    elif name == 'mette':
        cloth = P.floral('blouse', '#eee6da', ['#c98f86', '#93a883'], scale=14)
        F.clay(body, R * 0.012, smooth=10, mat=cloth, name='blouse')
        F.ring(C + Vector((0, R * 0.03, -R * 1.22)), R * 0.3, R * 0.035, cloth, scale=(1, 0.85, 1), rot=(0.2, 0, 0), name='frill')
    elif name == 'pelle':
        hood_m = F.fabric(F.material('fleece', '#1d2438', rough=0.95, sheen=0.35), scale=300, strength=0.3)
        F.clay(body, R * 0.012, smooth=10, mat=hood_m, name='hoodie')
        bf = F.surface_finder(bpy.data.objects['hoodie'])
        tee_pts = [bf(C + Vector((0, 0, -R * z)), Vector((0, -1, 0)))[0] for z in (1.25, 1.45, 1.65)]
        F.strand(tee_pts, [R * 0.13, R * 0.1, R * 0.05], F.material('tee', '#f5f3ee', rough=0.85), name='tee')
        F.ring(C + Vector((0, R * 0.18, -R * 1.2)), R * 0.36, R * 0.08, hood_m, scale=(1, 0.8, 1), rot=(0.35, 0, 0), name='hood')
        for s in (-1, 1):
            F.strand([C + Vector((s * R * 0.12, -R * 0.36, -R * 1.25)), C + Vector((s * R * 0.13, -R * 0.42, -R * 1.45))], [R * 0.012] * 2, F.material('cord', '#f0ece4', rough=0.7), name='cord')
    else:
        cloth = P.spotted('suit', '#b39572', '#3a2a1f', scale=12.0)
        F.clay(body, R * 0.012, smooth=10, mat=cloth, name='suit')
        F.ring(C + Vector((0, R * 0.03, -R * 1.0)), R * 0.31, R * 0.03, cloth, scale=(1, 0.85, 1), rot=(0.2, 0, 0), name='collar')

    # ---------- light, backdrop, camera ----------
    w = bpy.data.worlds.new('w')
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = F.lin(Pp['bg'])
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.0
    bpy.context.scene.world = w
    for loc, e, size, col in (((-1.6, -3, 2.6), 320, 2.5, '#fff6ec'), ((2.2, -2.4, 1.2), 120, 3, '#e8eeff'), ((0.5, 2.5, 2.6), 220, 2, '#fff0dc')):
        l = bpy.data.lights.new('l', 'AREA')
        l.energy = e
        l.size = size
        l.color = F.lin(col)[:3]
        o = bpy.data.objects.new('l', l)
        bpy.context.collection.objects.link(o)
        o.location = loc
        o.rotation_mode = 'QUATERNION'
        o.rotation_quaternion = (C - Vector(loc)).to_track_quat('-Z', 'Y')
    scn = bpy.context.scene
    if FULL:
        floor_z = C.z - R * (1.97 if baby else 2.85)
        P_base = F.box(Vector((0, 0, floor_z - 0.06)), (1.6, 1.6, 0.12), F.material('base', '#e9dcc8', rough=0.8), bevel=0.04)
        mid = (C.z + R + floor_z) / 2
        if EXPORT:
            bpy.data.objects.remove(P_base)
            export(name, floor_z, os.path.join(os.path.dirname(__file__), 'out'))
            return
        F.look((0, -6.2, mid + 0.3), (0, 0, mid), lens=58)
        F.render(os.path.join(outdir, f'full-{name}.png'), res=(720, 960), samples=64)
        F.look((3.6, -5.0, mid + 0.6), (0, 0, mid), lens=58)
        F.render(os.path.join(outdir, f'full-{name}-34.png'), res=(720, 960), samples=48)
        return
    F.look((0, -4.3, 0.95), (0, 0, 0.78), lens=58)
    scn.view_settings.look = 'AgX - Punchy'
    F.render(os.path.join(outdir, f'alt-{name}.png'), res=(720, 720), samples=96)
    F.look((2.6, -3.4, 1.15), (0, 0, 0.8), lens=58)
    F.render(os.path.join(outdir, f'alt-{name}-34.png'), res=(720, 720), samples=48)
    F.look((-2.6, 3.4, 1.15), (0, 0, 0.8), lens=58)
    F.render(os.path.join(outdir, f'alt-{name}-back.png'), res=(540, 540), samples=24)


names = args[1].split(',') if len(args) > 1 else list(PEOPLE)
for n in names:
    build(n, PEOPLE[n])
