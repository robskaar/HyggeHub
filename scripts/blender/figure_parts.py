# The parts every figurine is built from, in the style worked out on Robert (robert.py): a head melted
# from soft shapes with eye sockets, painted skin (hair colour above a hairline, blush), cartoon eyes with
# lids and lashes, brows, a closed or open smile; a body of clothes. Each person's script picks and tunes
# them and adds their own hair and clothes.
import math

import bmesh
import bpy
from mathutils import Vector

import figure_lib as F


class Head:
    """A head of radius R centred at HC, built from a face shape. `h(x, front, up)` is a point in head
    units (x right, front towards the viewer, up up); `on_face(x, up)` the surface point that way."""

    def __init__(self, R, HC, skin_hex, jaw=(0.82, 0.78, 0.62), cheeks=(0.42, 0.5, -0.28, 0.22), chin=(0.3, 0.28, 0.2), nose=(0.1, 0.09, 0.085), cranium=(0.97, 0.96, 1.0), eye=(0.38, 0.6, -0.1, 0.27), ears=1.0):
        self.R = R
        self.HC = Vector(HC)
        self.skin_hex = skin_hex
        h = self.h
        parts = [
            F.sphere(h(0, -0.04, 0.1), (R * cranium[0], R * cranium[1], R * cranium[2])),
            F.sphere(h(0, 0.1, -0.34), (R * jaw[0], R * jaw[1], R * jaw[2])),
            F.sphere(h(0, 0.95, -0.24), (R * nose[0], R * nose[1], R * nose[2])),
        ]
        if chin:
            parts.append(F.sphere(h(0, 0.36, -0.66), (R * chin[0], R * chin[1], R * chin[2])))
        cx, cf, cu, cr = cheeks
        for s in (-1, 1):
            parts.append(F.sphere(h(s * cx, cf, cu), (R * cr,) * 3))
            parts.append(F.sphere(h(s * 0.97, 0.02, -0.14), (R * 0.1 * ears, R * 0.15 * ears, R * 0.19 * ears), rot=(0, 0, s * 0.4)))
        self.obj = F.clay(parts, R * 0.018, smooth=12, name='head')
        ex, ef, eu, er = eye
        self.eR = R * er
        self.eyes = [h(s * ex, ef, eu) for s in (-1, 1)]
        for c in self.eyes:
            cut = F.sphere(c, (self.eR * 1.04,) * 3)
            m = self.obj.modifiers.new('socket', 'BOOLEAN')
            m.operation = 'DIFFERENCE'
            m.object = cut
            m.solver = 'EXACT'
            F.apply_all(self.obj)
            bpy.data.objects.remove(cut)
        sm = self.obj.modifiers.new('smooth', 'CORRECTIVE_SMOOTH')
        sm.iterations = 4
        F.apply_all(self.obj)
        F.shade_smooth(self.obj)
        self.centre = self.HC + Vector((0, R * 0.04, R * 0.08))
        self.find = F.surface_finder(self.obj)

    def h(self, x, front, up):
        return self.HC + Vector((x * self.R, -front * self.R, up * self.R))

    @staticmethod
    def dirn(x, front, up):
        return Vector((x, -front, up)).normalized()

    def on_face(self, x, up, lift=0.0, front=1.0):
        p, n = self.find(self.HC, self.dirn(x, front, up))
        return p + n * self.R * lift

    def angles(self, co):
        """(theta down from the top, angle round from the front) of a point, about the skull's centre."""
        v = co - self.centre
        return math.acos(max(-1, min(1, v.z / v.length))), abs(math.atan2(v.x, -v.y)), v

    def paint(self, hairline=None, hair_hex=None, stubble=False, blush_hex='#f4a08f', blush=0.8, freckles=0.0):
        """Skin, with hair colour above `hairline` (a table of (angle round, theta)) and rosy cheeks."""
        R = self.R
        SKIN = F.lin(self.skin_hex)
        HAIR = F.lin(hair_hex) if hair_hex else SKIN
        BLUSH = F.lin(blush_hex)

        def line(a):
            for (a0, t0), (a1, t1) in zip(hairline, hairline[1:]):
                if a <= a1:
                    return t0 + (t1 - t0) * F.smoothstep(a0, a1, a)
            return hairline[-1][1]

        def amount(co):
            if not hairline:
                return 0.0
            theta, a, v = self.angles(co)
            ear = v.length > R * 1.05 and abs(v.x) > R * 0.85
            return 0.0 if ear else F.smoothstep(0.035, -0.035, theta - line(a))

        def colour(co):
            c = F.mixc(SKIN, HAIR, amount(co))
            for s in (-1, 1):
                d = (co - self.h(s * 0.56, 0.8, -0.36)).length / (R * 0.2)
                c = F.mixc(c, BLUSH, blush * (1 - F.smoothstep(0.3, 1.0, d)))
            return c

        self.hair_amount = amount
        F.paint(self.obj, colour)
        self.obj.data.materials.clear()
        if stubble:
            F.paint_attr(self.obj, 'hairmask', amount)
            self.obj.data.materials.append(F.stubbled_painted('headskin', self.skin_hex, rough=0.42, sss=0.3))
        else:
            self.obj.data.materials.append(F.painted('headskin', rough=0.42, sss=0.3))

    def eyes_(self, iris_hex, rim_hex, inner_hex=None, lash='man', look=0.1, lid=0.5):
        """Cartoon eyes: a ball with the iris drawn on, soft lids, a lash line (fuller with a flick for
        'woman', short for 'child'), catchlights."""
        eR = self.eR
        R = self.R
        eye = F.eye_material('eye', iris_hex, rim_hex, inner_hex)
        shine = F.material('shine', '#ffffff', rough=0.0, emission=8.0)
        lash_m = F.material('lash', '#2a1d16', rough=0.5)
        skin = F.material('lidskin', self.skin_hex, rough=0.42, sss=0.3)
        for i, c in enumerate(self.eyes):
            side = -1 if i == 0 else 1
            F.sphere(c, (eR,) * 3, eye, rot=(0, 0, side * look))
            fwd = Vector((side * look, -1, 0)).normalized()
            F.sphere(c + fwd * eR * 0.97 + Vector((side * -0.3 * eR, 0, 0.32 * eR)), (eR * 0.17,) * 3, shine)
            F.sphere(c + fwd * eR * 0.98 + Vector((side * 0.25 * eR, 0, -0.32 * eR)), (eR * 0.07,) * 3, shine)
            F.cap_of_sphere(c, eR * 1.04, lambda p: p.z > eR * lid and p.y < eR * 0.3, skin, thick=R * 0.03, name='lid')
            F.cap_of_sphere(c, eR * 1.03, lambda p: p.z < -eR * 0.82 and p.y < eR * 0.2, skin, thick=R * 0.02, name='lowlid')
            rr = math.sqrt((eR * 1.07) ** 2 - (eR * lid) ** 2)
            arc = [c + Vector((side * rr * math.sin(t), -rr * math.cos(t), eR * lid)) for t in (-1.3, -0.7, 0, 0.7, 1.3, 1.5)]
            w = {'man': 1.0, 'woman': 1.5, 'child': 0.8}[lash]
            F.strand(arc, [eR * 0.03 * w, eR * 0.06 * w, eR * 0.07 * w, eR * 0.08 * w, eR * 0.09 * w, eR * 0.03 * w], lash_m, name='lash')
            if lash == 'woman':
                # A flick at the outer corner, and lashes along the top.
                o = arc[-2]
                F.strand([o, o + Vector((side * eR * 0.22, -eR * 0.02, eR * 0.12))], [eR * 0.07, eR * 0.015], lash_m, name='flick')
                for t in (0.35, 0.75, 1.1):
                    b = c + Vector((side * rr * math.sin(t), -rr * math.cos(t), eR * lid))
                    F.strand([b, b + Vector((side * eR * 0.08, -eR * 0.06, eR * 0.12))], [eR * 0.035, eR * 0.01], lash_m, name='lash')

    def brows(self, hex_, thick=0.045, arch=0.0, high=0.0):
        R = self.R
        m = F.material('brow', hex_, rough=0.7)
        for side in (-1, 1):
            pts = [self.on_face(side * x, up + high, 0.03, front=0.85) for x, up in ((0.12, 0.33), (0.32, 0.39 + arch), (0.55, 0.31))]
            F.strand(pts, [R * thick * 0.85, R * thick, R * thick * 0.6], m, name='brow')

    def closed_smile(self, width=0.26, curve=0.38, up=-0.56, crease_hex='#5e3029', lip_hex='#d48a7c', lip=1.0):
        """A closed smile: a thin dark line, the corners up a little, a soft lower lip under it."""
        R = self.R
        crease = F.material('crease', crease_hex, rough=0.5)
        lower = F.material('lowerlip', lip_hex, rough=0.38, sss=0.3)
        xs = [-width, -width / 2, 0, width / 2, width]
        pts = [self.find(self.HC, self.dirn(x, 1, up + curve * x * x))[0] + self.dirn(x, 1, 0) * R * 0.004 for x in xs]
        F.strand(pts, [R * 0.007, R * 0.011, R * 0.012, R * 0.011, R * 0.007], crease, name='smile')
        # The lower lip: fuller in the middle, tapering into the corners of the mouth.
        lips = []
        for x, dip, r in ((-width, 0.0, 0.006), (-width * 0.6, 0.045, 0.026), (0, 0.06, 0.034), (width * 0.6, 0.045, 0.026), (width, 0.0, 0.006)):
            q, n = self.find(self.HC, self.dirn(x, 1, up + curve * x * x - dip * lip))
            lips.append((q - n * R * r * 0.35, R * r * lip))
        F.strand([q for q, _ in lips], [r for _, r in lips], lower, name='lowerlip')

    def grin(self, width=0.3, up=-0.5, depth=0.17, gap_tooth=True, tongue=True):
        """An open, happy grin: a crescent carved into the face, dark inside, upper teeth (with a gap
        where a milk tooth is missing), a tongue."""
        R = self.R
        h = self.h
        mouth = F.material('mouth', '#6b2a2a', rough=0.5)
        teeth = F.material('teeth', '#fbf8f2', rough=0.25, coat=0.4)
        tongue_m = F.material('tongue', '#e3807f', rough=0.4)
        mp = self.on_face(0, up)
        low = F.sphere(mp + Vector((0, R * 0.1, -R * depth * 0.2)), (R * width, R * 0.3, R * depth))
        top = F.sphere(mp + Vector((0, R * 0.1, R * depth * 0.95)), (R * width * 1.5, R * 0.5, R * depth * 1.25))
        b = low.modifiers.new('crescent', 'BOOLEAN')
        b.operation = 'DIFFERENCE'
        b.object = top
        b.solver = 'EXACT'
        F.apply_all(low)
        bpy.data.objects.remove(top)
        m = self.obj.modifiers.new('mouth', 'BOOLEAN')
        m.operation = 'DIFFERENCE'
        m.object = low
        m.solver = 'EXACT'
        F.apply_all(self.obj)
        # The inside of the mouth: a dark pocket behind the opening.
        inner = F.sphere(mp + Vector((0, R * 0.16, -R * depth * 0.25)), (R * width * 0.95, R * 0.12, R * depth * 0.95), mouth)
        bpy.data.objects.remove(low)
        sm = self.obj.modifiers.new('smooth', 'CORRECTIVE_SMOOTH')
        sm.iterations = 3
        F.apply_all(self.obj)
        F.shade_smooth(self.obj)
        self.find = F.surface_finder(self.obj)
        for k in range(-2, 3):
            if gap_tooth and k == 1:
                continue
            F.box(mp + Vector((k * R * width * 0.27, R * 0.035, -R * depth * 0.42)), (R * width * 0.26, R * 0.04, R * depth * 0.3), teeth, bevel=R * 0.012)
        if tongue:
            F.sphere(mp + Vector((0, R * 0.06, -R * depth * 1.0)), (R * width * 0.6, R * 0.1, R * depth * 0.3), tongue_m)
        return inner


def strap_curve(points, radius, mat, name='strap'):
    return F.strand(points, [radius] * len(points), mat, name=name)


def floral(name, base_hex, dot_hexes, scale=24.0, rough=0.85):
    """A soft fabric printed with small flowers (a blouse)."""
    m = F.material(name, base_hex, rough=rough, sheen=0.7)
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    vor = nt.nodes.new('ShaderNodeTexVoronoi')
    vor.inputs['Scale'].default_value = scale
    nt.links.new(tc.outputs['Object'], vor.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.interpolation = 'CONSTANT'
    e = ramp.color_ramp.elements
    e[0].position = 0.0
    e[0].color = F.lin(dot_hexes[0])
    e[1].position = 0.22
    e[1].color = F.lin(base_hex)
    nt.links.new(vor.outputs['Distance'], ramp.inputs[0])
    # A second colour for every other flower.
    ramp2 = nt.nodes.new('ShaderNodeValToRGB')
    ramp2.color_ramp.interpolation = 'CONSTANT'
    e2 = ramp2.color_ramp.elements
    e2[0].color = F.lin(dot_hexes[0])
    e2[1].position = 0.5
    e2[1].color = F.lin(dot_hexes[1])
    nt.links.new(vor.outputs['Color'], ramp2.inputs[0])
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    nt.links.new(ramp.outputs['Color'], mix.inputs['B'])
    nt.links.new(ramp2.outputs['Color'], mix.inputs['A'])
    gt = nt.nodes.new('ShaderNodeMath')
    gt.operation = 'GREATER_THAN'
    gt.inputs[1].default_value = 0.22
    nt.links.new(vor.outputs['Distance'], gt.inputs[0])
    nt.links.new(gt.outputs[0], mix.inputs['Factor'])
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    return F.fabric(m, scale=700, strength=0.08)


def spotted(name, base_hex, spot_hex, scale=28.0, rough=0.85):
    """A soft fabric with a cheetah print: dark rosettes on a beige ground."""
    m = F.material(name, base_hex, rough=rough, sheen=0.8)
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    vor = nt.nodes.new('ShaderNodeTexVoronoi')
    vor.inputs['Scale'].default_value = scale
    vor.inputs['Randomness'].default_value = 0.9
    nt.links.new(tc.outputs['Object'], vor.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.interpolation = 'CONSTANT'
    e = ramp.color_ramp.elements
    e[0].color = F.lin(spot_hex)
    e[1].position = 0.24
    e[1].color = F.lin(base_hex)
    nt.links.new(vor.outputs['Distance'], ramp.inputs[0])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    return F.fabric(m, scale=900, strength=0.1)


def base(wood_hex='#c49a6c'):
    """The little diorama base the previews stand on."""
    F.box((0, 0, -0.055), (1.1, 1.1, 0.11), F.material('base', '#3d3632', rough=0.5, coat=0.4), bevel=0.035)
    F.box((0, 0, 0.004), (1.06, 1.06, 0.02), F.fabric(F.material('wood', wood_hex, rough=0.65), scale=60, strength=0.08), bevel=0.008)


def previews(out, centre_z, face_z, front=False):
    F.studio()
    F.look((1.15, -3.3, 1.2), (0, 0, centre_z), lens=62)
    F.render(out, res=(720, 960), samples=64)
    F.look((-1.4, 2.6, 1.2), (0, 0, centre_z + 0.1), lens=55)
    F.render(out.replace('.png', '-back.png'), res=(540, 720), samples=24)
    F.look((0.45, -1.6, face_z + 0.12), (0, 0, face_z), lens=70)
    F.render(out.replace('.png', '-face.png'), res=(720, 720), samples=64)
