# Hjalte (1) as a figurine, in the style of robert.py: a big round baby head with chubby cheeks, big
# blue-grey eyes, a little open mouth, fine strawberry-blond hair; sitting with his legs out in front in a
# beige long-sleeved suit with a cheetah print, soft socks.
#   blender --background --python scripts/blender/hjalte.py -- out.png
import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(__file__))
import figure_lib as F  # noqa: E402
import figure_parts as P  # noqa: E402

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.abspath('hjalte.png')
F.reset()

SKIN = '#f7d2bb'
HAIR = '#d0965c'
R = 0.3
HC = Vector((0, 0, 0.6))

head = P.Head(R, HC, SKIN, jaw=(0.9, 0.82, 0.58), cheeks=(0.44, 0.5, -0.36, 0.3), chin=None, nose=(0.075, 0.06, 0.06), eye=(0.37, 0.62, -0.16, 0.27), ears=0.95)
head.paint(hairline=[(0.0, 0.75), (0.7, 0.85), (1.0, 1.1), (1.15, 1.7), (1.3, 1.7), (1.4, 1.6), (1.62, 1.6), (1.85, 2.05), (2.3, 2.4), (math.pi, 2.5)], hair_hex=HAIR, blush=1.0, blush_hex='#f39a8c')
head.eyes_('#7d93a6', '#3b4b5a', inner_hex='#9fb2c2', lash='child', lid=0.72)
head.brows('#d1a87c', thick=0.025, arch=0.02, high=0.03)

# Fine hair showing under the hat, down round the ears and at the nape.
def under_hat(co):
    v = co - head.centre
    return head.hair_amount(co) > 0.5 and v.z < R * 0.1


F.shell(head.obj, under_hat, R * 0.035, R * 0.013, smooth=10, mat=F.material('hairunder', HAIR, rough=0.6, sheen=0.4), name='hair')

# A small, sweet closed smile.
head.closed_smile(width=0.13, curve=0.9, up=-0.56, crease_hex='#8a4a42', lip_hex='#eba196', lip=0.8)

# Fine baby hair: a few soft locks lying forward over the top, a little tuft.
hair_m = F.material('hair', HAIR, rough=0.6, sheen=0.4)


def skull(theta, phi, lift):
    d = Vector((math.sin(theta) * math.sin(phi), -math.sin(theta) * math.cos(phi), math.cos(theta)))
    p, n = head.find(head.centre, d)
    return p + n * R * lift


locks = []
for phi in (-0.7, -0.35, 0.0, 0.35, 0.7):
    locks.append(F.strand([skull(0.45, math.pi + phi * 0.6, 0.02), skull(0.15, phi * 0.2, 0.05), skull(0.55, phi, 0.03)], [R * 0.08, R * 0.1, R * 0.03]))
locks.append(F.strand([skull(0.05, 0.0, 0.02), skull(0.0, 0.0, 0.18), skull(0.25, 0.6, 0.2)], [R * 0.05, R * 0.04, R * 0.015]))
F.clay(locks, R * 0.014, smooth=4, mat=hair_m, name='hair')

# A little yellow hard hat (he loves diggers), like a real one in miniature: a tall rounded shell with
# three raised ridges front to back, a peak out over the forehead and a narrow brim round the rest,
# turned up a little at the sides; a sticker on the front.
hat_m = F.material('hat', '#f7b500', rough=0.3, coat=0.5)
hc = head.centre + Vector((0, R * 0.02, R * 0.1))
HR = R * 1.1
shell_ = F.cap_of_sphere(hc, HR, lambda p: p.z > -R * 0.02, hat_m, thick=R * 0.05, name='hat')
for vtx in shell_.data.vertices:
    d = vtx.co - hc
    vtx.co = hc + Vector((d.x * 0.98, d.y * 1.04, d.z * 1.06))
hf = F.surface_finder(shell_)
for x in (-0.32, 0.0, 0.32):
    pts = []
    for t in (-0.95, -0.6, -0.25, 0.1, 0.45, 0.8):
        dv = Vector((x, math.sin(t), math.cos(t)))
        p, n = hf(hc, dv)
        pts.append(p + n * R * 0.005)
    F.strand(pts, [R * 0.03, R * 0.05, R * 0.055, R * 0.055, R * 0.05, R * 0.03] if x == 0 else [R * 0.02, R * 0.035, R * 0.04, R * 0.04, R * 0.035, R * 0.02], hat_m, name='ridge')
# The brim: all round, much longer at the front (the peak); its edge turned up a little.
brim = F.sphere(hc + Vector((0, -R * 0.2, -R * 0.02)), (HR * 1.14, HR * 1.32, R * 0.035), hat_m)
F.bake_transform(brim)
for vtx in brim.data.vertices:
    d = vtx.co - hc
    r = math.hypot(d.x / 1.0, d.y / 1.1) / HR
    vtx.co.z += max(0.0, r - 1.0) ** 2 * R * 0.6 * (1.0 if d.y > -HR * 0.6 else 0.25)
cut = F.sphere(hc, (HR * 0.96, HR * 1.0, HR * 1.02))
m = brim.modifiers.new('cut', 'BOOLEAN')
m.operation = 'DIFFERENCE'
m.object = cut
m.solver = 'EXACT'
F.apply_all(brim)
bpy.data.objects.remove(cut)
F.shade_smooth(brim)
# A sticker on the front: a little digger arm, black on a white oval.
sp, sn = hf(hc, Vector((0, -1, 0.55)))
white = F.material('sticker', '#fbfaf5', rough=0.6)
blk = F.material('stickerblack', '#1f1d1b', rough=0.5)
st = F.sphere(sp + sn * R * 0.004, (R * 0.16, R * 0.16, R * 0.16), white)
F.bake_transform(st)
for vtx in st.data.vertices:
    d = vtx.co - sp
    vtx.co = sp + d - sn * d.dot(sn) * 0.9
F.shade_smooth(st)
up_ = (Vector((0, 0, 1)) - sn * sn.z).normalized()
rt = up_.cross(sn).normalized()
F.strand([sp - rt * R * 0.08 - up_ * R * 0.06 + sn * R * 0.02, sp - rt * R * 0.01 + up_ * R * 0.07 + sn * R * 0.025, sp + rt * R * 0.08 + up_ * R * 0.01 + sn * R * 0.022], [R * 0.018] * 3, blk, name='arm')
F.sphere(sp + rt * R * 0.085 - up_ * R * 0.03 + sn * R * 0.022, (R * 0.035,) * 3, blk)

# ---------- body: sitting ----------
# Sitting like a toddler does: legs in a loose V with the knees a little up, feet turned out showing
# their soles' edges; arms relaxed with the elbows bent, hands resting on his thighs. Short sleeves and
# legs on the suit (summer), bare feet in little sandals.
skin = F.material('skin', SKIN, rough=0.42, sss=0.3)
suit = P.spotted('suit', '#b39572', '#3a2a1f', scale=18.0)
sandal = F.material('sandal', '#8a5a3a', rough=0.55)
sole_m = F.material('sandalsole', '#5a3a26', rough=0.7)
F.clay([F.capsule((0, 0, 0.33), (0, 0, HC.z - R * 0.6), 0.06, 0.055)], 0.005, smooth=6, mat=skin, name='neck')
SHOULDER = {s: Vector((s * 0.135, 0.0, 0.34)) for s in (-1, 1)}
ELBOW = {s: Vector((s * 0.2, -0.04, 0.23)) for s in (-1, 1)}
HAND = {s: Vector((s * 0.15, -0.16, 0.15)) for s in (-1, 1)}
HIP = {s: Vector((s * 0.08, -0.03, 0.1)) for s in (-1, 1)}
KNEE = {s: Vector((s * 0.13, -0.2, 0.085)) for s in (-1, 1)}
ANKLE = {s: Vector((s * 0.16, -0.31, 0.075)) for s in (-1, 1)}
body = F.clay(
    [
        F.sphere((0, 0, 0.2), (0.17, 0.155, 0.17)),
        F.sphere((0, 0, 0.31), (0.15, 0.12, 0.08)),
        *[F.capsule(SHOULDER[s], SHOULDER[s].lerp(ELBOW[s], 0.6), 0.056, 0.052) for s in (-1, 1)],
        *[F.capsule(HIP[s], KNEE[s], 0.075, 0.065) for s in (-1, 1)],
    ],
    0.005,
    smooth=14,
    mat=suit,
    name='suit',
)
F.ring((0, 0, 0.345), 0.06, 0.012, suit, rot=(0.15, 0, 0), name='collar')
for s in (-1, 1):
    # A chubby arm from the sleeve, bent at the elbow, the hand resting on his thigh.
    F.clay(
        [
            F.capsule(SHOULDER[s].lerp(ELBOW[s], 0.45), ELBOW[s], 0.045, 0.043),
            F.capsule(ELBOW[s], HAND[s], 0.043, 0.04),
            F.sphere(HAND[s] + Vector((0, -0.02, -0.005)), (0.042, 0.048, 0.034)),
            F.capsule(HAND[s] + Vector((-s * 0.03, -0.01, 0.01)), HAND[s] + Vector((-s * 0.04, -0.035, 0.0)), 0.014),
        ],
        0.004,
        smooth=8,
        mat=skin,
        name='arm',
    )
    # A chubby shin out of the suit's leg; the bare foot at its end with the toes up and the sole to the
    # front, in a little sandal.
    foot = ANKLE[s] + Vector((s * 0.005, -0.03, 0.035))
    F.clay(
        [
            F.capsule(HIP[s].lerp(KNEE[s], 0.8), ANKLE[s], 0.052, 0.044),
            F.sphere(foot, (0.045, 0.038, 0.07)),
            *[F.sphere(foot + Vector((t * 0.016, -0.01, 0.07)), (0.012, 0.012, 0.013)) for t in (-1.2, -0.4, 0.4, 1.2)],
        ],
        0.0035,
        smooth=8,
        mat=skin,
        name='leg',
    )
    F.clay([F.sphere(foot + Vector((0, -0.04, 0.0)), (0.052, 0.012, 0.08))], 0.003, smooth=6, mat=sole_m, name='sole')
    F.ring(foot + Vector((0, 0, 0.025)), 0.048, 0.008, sandal, scale=(1, 0.88, 1), name='toestrap')
    F.ring(ANKLE[s] + Vector((0, -0.01, 0.0)), 0.048, 0.008, sandal, rot=(0.5, 0, 0), name='anklestrap')

P.base()
P.previews(out, 0.35, HC.z)
