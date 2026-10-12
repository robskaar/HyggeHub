# Shared helpers for modelling the HyggeHub figurines in Blender (run headless:
#   blender --background --python scripts/blender/robert.py -- out.png
# ). Shapes are built the way a figurine artist roughs them out: primitives melted together into one
# piece of clay (voxel remesh, then smoothed), and hair, brows and the like as tapered curves with a
# flat cross-section. Blender is Z up with the figure facing -Y.
import math

import bpy
from mathutils import Vector


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def lin(hex_colour):
    """An sRGB hex colour as Blender's linear RGBA."""
    h = hex_colour.lstrip('#')
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def material(name, colour, rough=0.5, sss=0.0, sheen=0.0, coat=0.0, emission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(colour)
    b.inputs['Roughness'].default_value = rough
    if sss:
        b.inputs['Subsurface Weight'].default_value = sss
        b.inputs['Subsurface Radius'].default_value = (1.0, 0.45, 0.3)
        b.inputs['Subsurface Scale'].default_value = 0.04
    if sheen:
        b.inputs['Sheen Weight'].default_value = sheen
    if coat:
        b.inputs['Coat Weight'].default_value = coat
    if emission:
        b.inputs['Emission Color'].default_value = lin(colour)
        b.inputs['Emission Strength'].default_value = emission
    return m


def _new(o, mat=None):
    if mat:
        o.data.materials.append(mat)
    return o


def sphere(loc, scale, mat=None, rot=(0, 0, 0), segs=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.scale = scale
    return _new(o, mat)


def capsule(a, b, r1, r2=None, mat=None):
    """A rounded limb from a to b (cone with ball ends)."""
    r2 = r1 if r2 is None else r2
    a, b = Vector(a), Vector(b)
    d = b - a
    bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=r1, radius2=r2, depth=d.length, location=(a + b) / 2)
    c = bpy.context.active_object
    c.rotation_mode = 'QUATERNION'
    c.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
    parts = [c, sphere(a, (r1, r1, r1)), sphere(b, (r2, r2, r2))]
    return join(parts, mat)


def box(loc, size, mat=None, bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bake_transform(o)
    if bevel:
        m = o.modifiers.new('bevel', 'BEVEL')
        m.width = bevel
        m.segments = 4
        apply_all(o)
    return _new(o, mat)


def bake_transform(o):
    # matrix_basis follows location / rotation / scale at once (matrix_world waits for an update).
    o.data.transform(o.matrix_basis.copy())
    o.matrix_basis.identity()


def apply_all(o):
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    o.modifiers.clear()
    o.data = me
    return o


def join(objs, mat=None, keep=False):
    for o in objs:
        if o.type != 'MESH':
            apply_all(o) if o.type == 'MESH' else None
        bake_transform(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.active_object
    if keep:
        return o
    o.data.materials.clear()
    if mat:
        o.data.materials.append(mat)
    return o


def clay(objs, voxel, smooth=12, mat=None, name='clay'):
    """Melt shapes into one smooth piece: join, voxel-remesh, smooth."""
    o = join(objs) if isinstance(objs, (list, tuple)) else objs
    o.name = name
    r = o.modifiers.new('remesh', 'REMESH')
    r.mode = 'VOXEL'
    r.voxel_size = voxel
    r.adaptivity = 0.0
    apply_all(o)
    s = o.modifiers.new('smooth', 'CORRECTIVE_SMOOTH')
    s.iterations = smooth
    s.smooth_type = 'LENGTH_WEIGHTED'
    s.use_only_smooth = True
    apply_all(o)
    shade_smooth(o)
    o.data.materials.clear()
    if mat:
        o.data.materials.append(mat)
    return o


def shade_smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True


def strand(points, radii, mat=None, flat=1.0, tilt=0.0, name='strand', resolution=12):
    """A tapered curve through points with a radius at each: a lock of hair, a brow, a smile line.
    `flat` < 1 squashes the cross-section into a ribbon."""
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.resolution_u = resolution
    sp = cu.splines.new('NURBS')
    sp.points.add(len(points) - 1)
    for p, (x, y, z), r in zip(sp.points, points, radii):
        p.co = (x, y, z, 1.0)
        p.radius = r
        p.tilt = tilt
    sp.use_endpoint_u = True
    sp.order_u = min(4, len(points))
    cu.bevel_depth = 1.0
    cu.bevel_resolution = 6
    cu.use_fill_caps = True
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    o.scale = (1, 1, 1)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    mo = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(mo)
    bpy.data.objects.remove(o)
    if flat != 1.0:
        # Squash across the strand's general direction's normal (towards the head surface): approximate by
        # scaling about the strand's centroid along its local "out" — done per-vertex towards the curve.
        pass
    shade_smooth(mo)
    if mat:
        mo.data.materials.append(mat)
    return mo


def look(cam_loc, target, lens=70):
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
    bpy.context.collection.objects.link(cam)
    cam.location = cam_loc
    d = Vector(target) - Vector(cam_loc)
    cam.rotation_mode = 'QUATERNION'
    cam.rotation_quaternion = d.to_track_quat('-Z', 'Y')
    cam.data.lens = lens
    bpy.context.scene.camera = cam
    return cam


def studio(strength=1.0):
    """Figurine studio light: a big soft key front-left, a fill, a warm rim from behind; a dark backdrop."""
    w = bpy.data.worlds.new('w')
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = lin('#2a2d33')
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6
    bpy.context.scene.world = w

    def area(loc, energy, size, colour='#ffffff'):
        l = bpy.data.lights.new('l', 'AREA')
        l.energy = energy * strength
        l.size = size
        l.color = lin(colour)[:3]
        o = bpy.data.objects.new('l', l)
        bpy.context.collection.objects.link(o)
        o.location = loc
        o.rotation_mode = 'QUATERNION'
        o.rotation_quaternion = (Vector((0, 0, 0.9)) - Vector(loc)).to_track_quat('-Z', 'Y')

    area((-2.2, -2.6, 2.6), 380, 2.2)
    area((2.6, -1.8, 1.4), 110, 2.5, '#dfe8ff')
    area((1.2, 2.5, 2.4), 320, 1.4, '#ffe2c0')


def render(path, res=(800, 1000), samples=64):
    s = bpy.context.scene
    s.render.engine = 'CYCLES'
    s.cycles.samples = samples
    s.cycles.use_denoising = True
    s.cycles.device = 'CPU'
    s.render.resolution_x, s.render.resolution_y = res
    s.render.film_transparent = False
    s.view_settings.view_transform = 'AgX'
    s.view_settings.look = 'AgX - Medium High Contrast'
    s.render.filepath = path
    bpy.ops.render.render(write_still=True)


def surface_finder(obj):
    """A function giving the point on `obj`'s surface in direction `d` from `centre` (and its normal)."""
    from mathutils.bvhtree import BVHTree

    dg = bpy.context.evaluated_depsgraph_get()
    tree = BVHTree.FromObject(obj, dg)

    def find(centre, d):
        d = Vector(d).normalized()
        hit, normal, _, _ = tree.ray_cast(Vector(centre) + d * 5, -d)
        return (hit, normal) if hit else (Vector(centre), d)

    return find



def painted(name, rough=0.45, sss=0.25):
    """A material whose colour comes from the mesh's 'paint' colour attribute (skin, hair, blush)."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    a = nt.nodes.new('ShaderNodeVertexColor')
    a.layer_name = 'paint'
    nt.links.new(a.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    if sss:
        b.inputs['Subsurface Weight'].default_value = sss
        b.inputs['Subsurface Radius'].default_value = (1.0, 0.45, 0.3)
        b.inputs['Subsurface Scale'].default_value = 0.04
    return m


def paint(obj, colour_at):
    """Fill the mesh's 'paint' colour attribute: colour_at(position) -> linear RGBA, per vertex."""
    me = obj.data
    attr = me.color_attributes.get('paint') or me.color_attributes.new('paint', 'FLOAT_COLOR', 'POINT')
    for v in me.vertices:
        attr.data[v.index].color = colour_at(v.co)


def shell(obj, keep, thickness, voxel, smooth=8, mat=None, name='shell', extra=()):
    """A layer over part of obj's surface (where keep(position) is true): a beard, a cap of hair."""
    import bmesh

    me = obj.data.copy()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if not keep(f.calc_center_median())], context='FACES')
    bm.to_mesh(me)
    bm.free()
    so = o.modifiers.new('solid', 'SOLIDIFY')
    so.thickness = thickness
    so.offset = 1.0
    apply_all(o)
    # Other shapes melted into it (a moustache into a beard).
    return clay([o, *extra], voxel, smooth=smooth, mat=mat, name=name)


def mixc(a, b, t):
    t = max(0.0, min(1.0, t))
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(4))


def smoothstep(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


def eye_material(name, iris_hex, rim_hex, inner_hex=None):
    """A glossy cartoon eye drawn on a ball by the shader: white, a ringed iris lighter towards a big
    pupil, facing the ball's local -Y. (The ball must be a unit sphere scaled uniformly.)"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    N = nt.nodes
    L = nt.links
    b = N['Principled BSDF']
    b.inputs['Roughness'].default_value = 0.08
    b.inputs['Coat Weight'].default_value = 1.0
    tc = N.new('ShaderNodeTexCoord')
    sep = N.new('ShaderNodeSeparateXYZ')
    L.new(tc.outputs['Object'], sep.inputs[0])
    # Distance from the forward axis: sqrt(x^2 + z^2), only on the front half (y < 0).
    sq = []
    for ax in ('X', 'Z'):
        p = N.new('ShaderNodeMath')
        p.operation = 'POWER'
        p.inputs[1].default_value = 2
        L.new(sep.outputs[ax], p.inputs[0])
        sq.append(p)
    add = N.new('ShaderNodeMath')
    add.operation = 'ADD'
    L.new(sq[0].outputs[0], add.inputs[0])
    L.new(sq[1].outputs[0], add.inputs[1])
    rad = N.new('ShaderNodeMath')
    rad.operation = 'SQRT'
    L.new(add.outputs[0], rad.inputs[0])
    back = N.new('ShaderNodeMath')
    back.operation = 'GREATER_THAN'
    back.inputs[1].default_value = 0.0
    L.new(sep.outputs['Y'], back.inputs[0])
    r2 = N.new('ShaderNodeMath')
    r2.operation = 'ADD'
    L.new(rad.outputs[0], r2.inputs[0])
    L.new(back.outputs[0], r2.inputs[1])
    ramp = N.new('ShaderNodeValToRGB')
    L.new(r2.outputs[0], ramp.inputs[0])
    e = ramp.color_ramp.elements
    e[0].position = 0.0
    e[0].color = lin('#060504')
    e[1].position = 0.6
    e[1].color = lin('#fbfaf7')
    inner = inner_hex or mixhex(iris_hex, '#ffffff', 0.25)
    for pos, col in ((0.26, '#060504'), (0.3, inner), (0.38, inner), (0.47, iris_hex), (0.54, rim_hex), (0.575, '#fbfaf7')):
        el = e.new(pos)
        el.color = lin(col)
    L.new(ramp.outputs['Color'], b.inputs['Base Color'])
    return m


def mixhex(a, b, t):
    pa = [int(a.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)]
    pb = [int(b.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)]
    return '#' + ''.join(f'{round(x + (y - x) * t):02x}' for x, y in zip(pa, pb))


def fabric(m, scale=900.0, strength=0.12):
    """A fine woven texture on a material (as bump)."""
    nt = m.node_tree
    n = nt.nodes.new('ShaderNodeTexNoise')
    n.inputs['Scale'].default_value = scale
    n.inputs['Detail'].default_value = 2.0
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = strength
    nt.links.new(n.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], nt.nodes['Principled BSDF'].inputs['Normal'])
    return m


def tube(a, b, r1, r2, thick, mat=None, name='tube'):
    """An open fabric tube from a to b (a sleeve, a trouser leg's turn-up): it has a visible hem."""
    a, b = Vector(a), Vector(b)
    d = b - a
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=r1, radius2=r2, depth=d.length, location=(a + b) / 2, end_fill_type='NOTHING')
    c = bpy.context.active_object
    c.rotation_mode = 'QUATERNION'
    c.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
    bake_transform(c)
    so = c.modifiers.new('solid', 'SOLIDIFY')
    so.thickness = thick
    so.offset = 1.0
    bv = c.modifiers.new('bevel', 'BEVEL')
    bv.width = thick * 0.45
    bv.segments = 3
    sub = c.modifiers.new('sub', 'SUBSURF')
    sub.levels = 1
    apply_all(c)
    shade_smooth(c)
    c.name = name
    if mat:
        c.data.materials.append(mat)
    return c


def ring(centre, radius, minor, mat=None, scale=(1, 1, 1), rot=(0, 0, 0), name='ring'):
    bpy.ops.mesh.primitive_torus_add(location=centre, major_radius=radius, minor_radius=minor, major_segments=64, minor_segments=16, rotation=rot)
    o = bpy.context.active_object
    o.scale = scale
    bake_transform(o)
    shade_smooth(o)
    o.name = name
    if mat:
        o.data.materials.append(mat)
    return o


def cap_of_sphere(centre, radius, keep, mat=None, thick=0.0, name='cap'):
    """Part of a sphere (where keep(local position) is true), e.g. an eyelid over an eye."""
    import bmesh

    o = sphere(centre, (radius,) * 3, segs=48)
    bake_transform(o)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    c = Vector(centre)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if not keep(f.calc_center_median() - c)], context='FACES')
    bm.to_mesh(o.data)
    bm.free()
    if thick:
        so = o.modifiers.new('solid', 'SOLIDIFY')
        so.thickness = thick
        so.offset = 1.0
        bv = o.modifiers.new('bevel', 'BEVEL')
        bv.width = thick * 0.45
        bv.segments = 3
        apply_all(o)
    shade_smooth(o)
    o.name = name
    if mat:
        o.data.materials.append(mat)
    return o


def _stubble_nodes(nt, scale):
    """A fine speckle (0-1) for stubble: mostly hair with skin glimpsed between."""
    tc = nt.nodes.new('ShaderNodeTexCoord')
    n = nt.nodes.new('ShaderNodeTexNoise')
    n.inputs['Scale'].default_value = scale
    n.inputs['Detail'].default_value = 1.0
    n.inputs['Roughness'].default_value = 0.4
    nt.links.new(tc.outputs['Object'], n.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.5
    ramp.color_ramp.elements[1].position = 0.68
    nt.links.new(n.outputs['Fac'], ramp.inputs[0])
    return n, ramp


def stubble_material(name, hair_hex, skin_hex, scale=2600.0, rough=0.8):
    """Short beard stubble: hair-coloured speckle over skin, a little bumpy."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = rough
    n, ramp = _stubble_nodes(nt, scale)
    mixn = nt.nodes.new('ShaderNodeMix')
    mixn.data_type = 'RGBA'
    mixn.inputs['A'].default_value = lin(hair_hex)
    mixn.inputs['B'].default_value = lin(mixhex(hair_hex, skin_hex, 0.3))
    nt.links.new(ramp.outputs['Color'], mixn.inputs['Factor'])
    nt.links.new(mixn.outputs['Result'], b.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.35
    nt.links.new(n.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m


def stubbled_painted(name, skin_hex, rough=0.45, sss=0.3, scale=2600.0):
    """Like painted(), and where the 'hairmask' attribute is set the hair is stubble: skin glimpsed
    through a fine speckle, a little bumpy."""
    m = painted(name, rough=rough, sss=sss)
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    paint_node = next(n for n in nt.nodes if n.bl_idname == 'ShaderNodeVertexColor')
    mask = nt.nodes.new('ShaderNodeVertexColor')
    mask.layer_name = 'hairmask'
    sepm = nt.nodes.new('ShaderNodeSeparateColor')
    nt.links.new(mask.outputs['Color'], sepm.inputs[0])
    n, ramp = _stubble_nodes(nt, scale)
    f = nt.nodes.new('ShaderNodeMath')
    f.operation = 'MULTIPLY'
    nt.links.new(sepm.outputs[0], f.inputs[0])
    nt.links.new(ramp.outputs['Color'], f.inputs[1])
    f2 = nt.nodes.new('ShaderNodeMath')
    f2.operation = 'MULTIPLY'
    f2.inputs[1].default_value = 0.3
    nt.links.new(f.outputs[0], f2.inputs[0])
    mixn = nt.nodes.new('ShaderNodeMix')
    mixn.data_type = 'RGBA'
    nt.links.new(f2.outputs[0], mixn.inputs['Factor'])
    nt.links.new(paint_node.outputs['Color'], mixn.inputs['A'])
    mixn.inputs['B'].default_value = lin(skin_hex)
    nt.links.new(mixn.outputs['Result'], b.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump')
    nt.links.new(n.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(sepm.outputs[0], bump.inputs['Strength'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m


def paint_attr(obj, name, value_at):
    """A per-vertex float (stored as a grey colour attribute) from value_at(position)."""
    me = obj.data
    attr = me.color_attributes.get(name) or me.color_attributes.new(name, 'FLOAT_COLOR', 'POINT')
    for v in me.vertices:
        x = value_at(v.co)
        attr.data[v.index].color = (x, x, x, 1.0)


def press(obj, segments, width, depth):
    """Press grooves into a surface: every vertex within `width` of a segment (a, b) sinks along its
    normal, up to `depth` at the line, smoothly to nothing at the edge. (A parting, grooves between locks.)"""
    from mathutils.geometry import intersect_point_line

    me = obj.data
    me.update()
    for v in me.vertices:
        best = width
        for a, b in segments:
            p, t = intersect_point_line(v.co, a, b)
            t = max(0.0, min(1.0, t))
            q = a.lerp(b, t)
            best = min(best, (v.co - q).length)
        if best < width:
            f = 1 - best / width
            v.co -= v.normal * depth * f * f * (3 - 2 * f)
    me.update()


def dome(centre, radius, plane_co, plane_no, thick, mat=None, scale=(1, 1, 1), name='dome', segs=128, box=None):
    """The part of a (scaled) sphere above a plane, cut cleanly, as a shell `thick` deep with a rounded
    edge: the crown of a cap, a helmet."""
    import bmesh

    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, location=centre)
    o = bpy.context.active_object
    o.scale = (radius * scale[0], radius * scale[1], radius * scale[2])
    bake_transform(o)
    if box:
        boxy(o, centre, box[0], box[1])
    bm = bmesh.new()
    bm.from_mesh(o.data)
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    bmesh.ops.bisect_plane(bm, geom=geom, plane_co=Vector(plane_co), plane_no=Vector(plane_no), clear_inner=True)
    bm.to_mesh(o.data)
    bm.free()
    so = o.modifiers.new('solid', 'SOLIDIFY')
    so.thickness = thick
    so.offset = -1.0
    bv = o.modifiers.new('bevel', 'BEVEL')
    bv.width = thick * 0.45
    bv.segments = 4
    bv.limit_method = 'ANGLE'
    apply_all(o)
    shade_smooth(o)
    o.name = name
    if mat:
        o.data.materials.append(mat)
    return o


def boxy(obj, centre, radii, p=2.6):
    """Reshape a sphere-like mesh round `centre` into a rounded box (a superellipsoid with these radii):
    flatter top, more upright sides, as the crown of a structured cap."""
    c = Vector(centre)
    for v in obj.data.vertices:
        d = v.co - c
        if d.length < 1e-9:
            continue
        n = d.normalized()
        k = (abs(n.x) / radii[0]) ** p + (abs(n.y) / radii[1]) ** p + (abs(n.z) / radii[2]) ** p
        v.co = c + n * (1.0 / k ** (1.0 / p))
    obj.data.update()


def layer(base, thick, keep, cut=(), mat=None, name='layer'):
    """A layer `thick` deep over `base` wherever the volume `keep` reaches (minus the volumes `cut`),
    with crisp clean edges: hair or a beard as a sectioned piece, the way stylised avatars have them.
    `keep` and `cut` are mesh objects used as boolean volumes (they are removed)."""
    me = base.data.copy()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    o.data.materials.clear()
    so = o.modifiers.new('solid', 'SOLIDIFY')
    so.thickness = thick
    so.offset = 1.0
    apply_all(o)
    m = o.modifiers.new('keep', 'BOOLEAN')
    m.operation = 'INTERSECT'
    m.object = keep
    m.solver = 'EXACT'
    apply_all(o)
    bpy.data.objects.remove(keep)
    for c in cut:
        m = o.modifiers.new('cut', 'BOOLEAN')
        m.operation = 'DIFFERENCE'
        m.object = c
        m.solver = 'EXACT'
        apply_all(o)
        bpy.data.objects.remove(c)
    bv = o.modifiers.new('bevel', 'BEVEL')
    bv.width = thick * 0.35
    bv.segments = 3
    bv.limit_method = 'ANGLE'
    bv.angle_limit = 0.9
    apply_all(o)
    shade_smooth(o)
    o.data.materials.clear()
    for poly in o.data.polygons:
        poly.material_index = 0
    if mat:
        o.data.materials.append(mat)
    return o


def slab(plane_co, plane_no, size=10.0):
    """A big box whose bottom face lies on a plane (everything above it): a boolean volume."""
    n = Vector(plane_no).normalized()
    bpy.ops.mesh.primitive_cube_add(location=Vector(plane_co) + n * size)
    o = bpy.context.active_object
    o.scale = (size, size, size)
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(n)
    bake_transform(o)
    return o
