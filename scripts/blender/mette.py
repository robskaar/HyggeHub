# Mette as a figurine, in the style of robert.py: a slimmer face, big blue-grey eyes with fuller lashes,
# fine arched brows, a gentle closed smile; long straight brown hair with a middle parting falling past
# her shoulders, lighter towards the ends; a cream blouse with small flowers and ruffled three-quarter
# sleeves, black trousers, light flats, the strap of a bag across her.
#   blender --background --python scripts/blender/mette.py -- out.png
import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(__file__))
import figure_lib as F  # noqa: E402
import figure_parts as P  # noqa: E402

out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.abspath('mette.png')
F.reset()

SKIN = '#f3c8ab'
HAIR = '#5a3b26'
HAIR_ENDS = '#9c7650'
R = 0.355
HC = Vector((0, 0, 0.86))

head = P.Head(R, HC, SKIN, jaw=(0.8, 0.76, 0.6), cheeks=(0.4, 0.5, -0.28, 0.21), chin=(0.24, 0.24, 0.18), nose=(0.085, 0.08, 0.075), eye=(0.37, 0.6, -0.1, 0.28))
head.paint(hairline=[(0.0, 0.8), (0.8, 0.95), (1.2, 1.45), (1.6, 1.6), (2.3, 2.3), (math.pi, 2.5)], hair_hex=HAIR, blush=0.9)
head.eyes_('#6f8ea6', '#2b3e4e', inner_hex='#8fb0c6', lash='woman')
head.brows('#5a3e2c', thick=0.03, arch=0.04, high=-0.05)
head.closed_smile(width=0.22, curve=0.5, lip_hex='#d9867c', crease_hex='#7a3a33', lip=1.25)


# ---------- hair: long and straight, parted in the middle ----------
def skull(theta, phi, lift):
    d = Vector((math.sin(theta) * math.sin(phi), -math.sin(theta) * math.cos(phi), math.cos(theta)))
    p, n = head.find(head.centre, d)
    return p + n * R * lift


# The hair, all locks: every lock starts on the middle parting (from the hairline over the forehead
# back to the crown) and falls to its side, so together they cover the whole head with the parting
# between them; the front ones sweep over the temples beside the face, the back ones down past the
# shoulders. From the crown, a fan of locks covers the back of the head, so there is no parting there.
# Each side is a piece of its own, so the parting stays crisp where they meet.
def hang_from(p, side):
    """From a point low on the side or back of the head, down to below the shoulders."""
    flat = Vector((p.x, p.y, 0))
    r_h = max(flat.length, R * 1.0)
    flat = flat.normalized()
    hang = Vector((flat.x * r_h * 1.02, flat.y * r_h * 1.02, 0))
    if abs(hang.x) < R * 0.9 and hang.y < 0:
        hang.x = side * R * 0.9  # beside the face, not over it (at the back they meet in the middle)
    hang.y = max(hang.y, -R * 0.42)
    return [hang + Vector((0, 0, min(HC.z - 0.7 * R, p.z - 0.25 * R))), hang * 0.98 + Vector((0, 0, HC.z - 1.3 * R)), hang * 0.92 + Vector((0, 0, HC.z - 1.68 * R))]


def on_parting(a, side):
    """A point on the parting, `a` radians from the top (positive towards the front)."""
    p, n = head.find(head.centre, Vector((0, -math.sin(a), math.cos(a))))
    return p + n * R * 0.05 + Vector((side * R * 0.012, 0, 0))


halves = []
back = []  # the locks at the back, from both sides: one piece, no parting there
for side in (-1, 1):
    parts = []
    for a in (0.84, 0.7, 0.56, 0.42, 0.28, 0.14, 0.0, -0.14, -0.28, -0.4, -0.48):
        # Where on the side it falls: the temple for the front of the parting, behind the ear for its back.
        u = (0.84 - a) / 1.32
        phi = 1.15 + u * (math.pi - 0.06 - 1.15)
        start = on_parting(a, side)
        th0 = max(abs(a), 0.15)
        p1 = skull(min(th0 + 0.35, 1.0), side * phi * (0.7 + 0.3 * u), 0.1)
        p2 = skull(1.15, side * phi, 0.13)
        p3 = skull(1.6, side * phi, 0.13)
        pts = [start, p1, p2, p3] + hang_from(p3, side)
        (back if u > 0.25 else parts).append(F.strand(pts, [R * 0.09, R * 0.14, R * 0.15, R * 0.15, R * 0.14, R * 0.12, R * 0.045], name='lock'))
    if side < 0:
        # The fan from the crown down the back, over where the two sides meet.
        crown = on_parting(-0.45, 0)
        # One lock straight down the middle, over where the two sides meet.
        p1 = skull(0.9, math.pi, 0.1)
        p2 = skull(1.55, math.pi, 0.11)
        back.append(F.strand([crown, p1, p2] + hang_from(p2, -1), [R * 0.1, R * 0.15, R * 0.15, R * 0.15, R * 0.12, R * 0.045], name='lock'))
    halves.append(F.clay(parts, R * 0.016, smooth=6, name='hair'))
halves.append(F.clay(back, R * 0.016, smooth=6, name='hair'))
hair = F.join(halves)
hair.name = 'hair'
F.shade_smooth(hair)
hair.data.materials.clear()


def hair_colour(co):
    t = F.smoothstep(HC.z - 0.6 * R, HC.z - 1.8 * R, co.z)
    return F.mixc(F.lin(HAIR), F.lin(HAIR_ENDS), t * 0.7)


F.paint(hair, hair_colour)
hm = F.painted('hair', rough=0.45, sss=0.0)
hm.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.1
hm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.55
hm.node_tree.nodes['Principled BSDF'].inputs['Sheen Weight'].default_value = 0.4
hair.data.materials.append(hm)

# ---------- body ----------
k = 0.94
skin = F.material('skin', SKIN, rough=0.42, sss=0.3)
blouse = P.floral('blouse', '#eee6da', ['#c98f86', '#93a883'])
trousers = F.fabric(F.material('trousers', '#25262b', rough=0.8, sheen=0.4), scale=1200, strength=0.15)
flats = F.material('flats', '#cfae8e', rough=0.5)
strap_m = F.material('strap', '#8b7a66', rough=0.6)


def v(x, y, z):
    return Vector((x * k, y * k, z * k))


SH = 0.5
F.clay([F.capsule(v(0, 0, SH - 0.08), (0, 0, HC.z - R * 0.5), 0.055, 0.05)], 0.005, smooth=8, mat=skin, name='neck')
SHOULDER = {s: v(s * 0.14, 0, SH - 0.06) for s in (-1, 1)}
ELBOW = {s: v(s * 0.2, -0.01, 0.31) for s in (-1, 1)}
WRIST = {s: v(s * 0.215, -0.035, 0.21) for s in (-1, 1)}
cuff = {s: ELBOW[s].lerp(WRIST[s], 0.25) for s in (-1, 1)}
torso = F.clay(
    [
        F.sphere(v(0, 0, 0.37), (0.17 * k, 0.14 * k, 0.13 * k)),
        F.sphere(v(0, 0, SH - 0.06), (0.18 * k, 0.125 * k, 0.06 * k)),
        F.capsule(v(0, 0, 0.27), v(0, 0, SH - 0.07), 0.165 * k, 0.15 * k),
        F.sphere(v(0, 0, 0.25), (0.18 * k, 0.15 * k, 0.07 * k)),
        *[F.capsule(SHOULDER[s], ELBOW[s], 0.064 * k, 0.06 * k) for s in (-1, 1)],
        *[F.capsule(ELBOW[s], cuff[s], 0.06 * k, 0.058 * k) for s in (-1, 1)],
    ],
    0.005,
    smooth=14,
    mat=blouse,
    name='blouse',
)
for s in (-1, 1):
    along = (WRIST[s] - ELBOW[s]).normalized()
    # A ruffle at the end of the sleeve, flaring out.
    F.tube(cuff[s] - along * 0.01, cuff[s] + along * 0.04, 0.056 * k, 0.078 * k, 0.006, blouse, name='ruffle')
    F.clay(
        [
            F.capsule(cuff[s] - along * 0.02, WRIST[s], 0.042 * k, 0.037 * k),
            F.sphere(WRIST[s] + v(s * 0.004, -0.006, -0.04), (0.042 * k, 0.034 * k, 0.05 * k)),
            F.capsule(WRIST[s] + v(-s * 0.019, -0.032, -0.018), WRIST[s] + v(-s * 0.023, -0.042, -0.047), 0.016 * k),
        ],
        0.005,
        smooth=8,
        mat=skin,
        name='arm',
    )
# A frill round the neckline.
F.ring(v(0, -0.01, SH + 0.005), 0.065 * k, 0.012, blouse, rot=(0.2, 0, 0), name='collar')
# Long black trousers and light flats.
F.clay([F.sphere(v(0, 0, 0.21), (0.16 * k, 0.13 * k, 0.07 * k))] + [F.capsule(v(s * 0.075, 0, 0.2), v(s * 0.075, -0.01, 0.06), 0.07 * k, 0.06 * k) for s in (-1, 1)], 0.005, smooth=10, mat=trousers, name='trousers')
for s in (-1, 1):
    F.clay([F.sphere(v(s * 0.075, -0.035, 0.04), (0.06 * k, 0.11 * k, 0.04 * k))], 0.005, smooth=8, mat=flats, name='flat')
# The strap of her bag across her, from her right shoulder to her left hip.
tf = F.surface_finder(torso)
pts = []
for t in (0.0, 0.2, 0.4, 0.6, 0.8, 1.0):
    a = v(-0.13, 0.0, SH - 0.03).lerp(v(0.16, 0.0, 0.25), t)
    p, n = tf(Vector((a.x, 0, a.z)), Vector((0, -1, 0)))
    pts.append(p + n * 0.007)
P.strap_curve(pts, 0.008, strap_m)

P.base()
P.previews(out, 0.58, HC.z)
