import math
import os
from PIL import Image, ImageDraw, ImageFilter

W, H = 880, 460
NUM_FRAMES = 40
FPS = 20
DURATION_MS = int(1000 / FPS)

output_dir = os.path.join(os.path.dirname(__file__), 'public', 'assets', 'animations')
os.makedirs(output_dir, exist_ok=True)
gif_path = os.path.join(output_dir, 'catalog-hardware.gif')
webp_path = os.path.join(output_dir, 'catalog-hardware.webp')

# Circuit trace paths: list of points [(x1, y1), (x2, y2), ...]
trace_paths = [
    # Power to CPU
    [(220, 90), (320, 90), (360, 150), (410, 150)],
    [(200, 110), (310, 110), (350, 160), (410, 160)],
    [(180, 130), (300, 130), (340, 170), (410, 170)],
    [(240, 70), (350, 70), (390, 130), (430, 140)],
    [(260, 50), (370, 50), (410, 120), (440, 140)],

    # CPU to RAM (Right side)
    [(510, 160), (570, 160), (610, 120), (670, 120)],
    [(510, 180), (580, 180), (620, 140), (670, 140)],
    [(510, 200), (590, 200), (630, 170), (670, 170)],
    [(510, 220), (600, 220), (640, 200), (670, 200)],
    [(510, 240), (600, 240), (640, 240), (670, 240)],
    [(510, 260), (590, 260), (630, 280), (670, 280)],
    [(510, 280), (580, 280), (620, 310), (670, 310)],
    [(510, 300), (570, 300), (610, 340), (670, 340)],

    # CPU to PCIe / GPU (Bottom)
    [(430, 320), (430, 360), (390, 400), (340, 400)],
    [(450, 320), (450, 370), (420, 400), (380, 400)],
    [(470, 320), (470, 380), (490, 400), (530, 400)],
    [(490, 320), (490, 370), (520, 400), (580, 400)],

    # CPU to M.2 SSD (Left side)
    [(410, 210), (350, 210), (320, 230), (220, 230)],
    [(410, 230), (340, 230), (310, 250), (220, 250)],
    [(410, 250), (350, 250), (310, 280), (220, 280)],
    [(410, 270), (360, 270), (320, 300), (220, 300)],
    [(410, 290), (370, 290), (330, 320), (240, 320)],

    # Interconnect bus lines
    [(160, 180), (260, 180), (290, 160), (320, 160)],
    [(150, 350), (280, 350), (330, 370), (400, 370)],
    [(600, 70), (660, 70), (700, 100), (740, 100)],
    [(620, 380), (680, 380), (720, 360), (770, 360)],
]

frames = []

for frame_idx in range(NUM_FRAMES):
    phase = frame_idx / NUM_FRAMES  # 0.0 to 1.0

    # Base image
    img = Image.new('RGB', (W, H), (10, 10, 13))
    draw = ImageDraw.Draw(img)

    # 1. Subtle PCB grid texture on background
    grid_spacing = 24
    for gx in range(0, W, grid_spacing):
        draw.line([(gx, 0), (gx, H)], fill=(16, 17, 24), width=1)
    for gy in range(0, H, grid_spacing):
        draw.line([(0, gy), (W, gy)], fill=(16, 17, 24), width=1)

    # Ambient background glow behind CPU (red/crimson)
    cpu_cx, cpu_cy = 460, 230
    pulse_val = 0.5 + 0.5 * math.sin(phase * 2 * math.pi)

    # Draw circuit traces (PCB copper / silver lines)
    for path in trace_paths:
        for i in range(len(path) - 1):
            draw.line([path[i], path[i+1]], fill=(32, 35, 48), width=2)

    # Draw via holes / connection dots
    for path in trace_paths:
        for pt in [path[0], path[-1]]:
            draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+2, pt[1]+2], fill=(45, 50, 70), outline=(60, 65, 90))

    # 2. Draw Hardware Components

    # (A) M.2 NVMe SSD Heatsink (Left)
    ssd_x1, ssd_y1, ssd_x2, ssd_y2 = 180, 210, 340, 290
    draw.rounded_rectangle([ssd_x1, ssd_y1, ssd_x2, ssd_y2], radius=4, fill=(18, 20, 26), outline=(48, 52, 68), width=2)
    # SSD Heatsink fins
    for fin_x in range(ssd_x1 + 16, ssd_x2 - 16, 14):
        draw.rectangle([fin_x, ssd_y1 + 8, fin_x + 6, ssd_y2 - 8], fill=(26, 30, 40), outline=(38, 44, 58))
    # SSD Gold Connector Pins
    for p in range(ssd_x1 + 10, ssd_x1 + 45, 4):
        draw.rectangle([p, ssd_y2 - 5, p + 2, ssd_y2], fill=(180, 140, 40))
    # SSD Text
    draw.text((ssd_x1 + 40, ssd_y1 + 12), "GEN 5 NVMe SSD", fill=(100, 110, 135))
    draw.text((ssd_x1 + 40, ssd_y1 + 24), "14,000 MB/s", fill=(200, 50, 60))
    # SSD Activity LED
    ssd_led_color = (255, 40, 50) if math.sin(phase * 4 * math.pi) > 0 else (120, 20, 25)
    draw.ellipse([ssd_x2 - 18, ssd_y1 + 12, ssd_x2 - 12, ssd_y1 + 18], fill=ssd_led_color)

    # (B) Power VRM Choke Stage (Top Left of CPU)
    for vrm_i, vrm_x in enumerate(range(260, 420, 28)):
        vrm_y = 65
        draw.rounded_rectangle([vrm_x, vrm_y, vrm_x + 22, vrm_y + 22], radius=3, fill=(22, 24, 30), outline=(50, 55, 70), width=1)
        draw.text((vrm_x + 4, vrm_y + 5), "R22", fill=(60, 65, 80))
        # Small SMD capacitors
        draw.rectangle([vrm_x + 5, vrm_y + 26, vrm_x + 17, vrm_y + 32], fill=(35, 40, 50), outline=(55, 60, 75))

    # (C) PCIe Gen 5 x16 Slot (Bottom)
    pcie_x1, pcie_y1, pcie_x2, pcie_y2 = 280, 390, 620, 412
    draw.rounded_rectangle([pcie_x1, pcie_y1, pcie_x2, pcie_y2], radius=3, fill=(16, 18, 24), outline=(55, 60, 75), width=2)
    # Armor shield lines
    draw.line([(pcie_x1 + 6, pcie_y1 + 11), (pcie_x2 - 40, pcie_y1 + 11)], fill=(75, 82, 100), width=2)
    # Retention clip
    draw.rounded_rectangle([pcie_x2 - 32, pcie_y1 + 2, pcie_x2 - 6, pcie_y2 - 2], radius=2, fill=(190, 30, 40), outline=(230, 50, 60))
    draw.text((pcie_x1 + 16, pcie_y1 + 3), "PCIe 5.0 x16 ARMOR", fill=(90, 100, 120))

    # (D) Dual DDR5 RAM Modules (Right)
    for dimm_idx, dimm_x in enumerate([680, 720]):
        dimm_y1, dimm_y2 = 80, 370
        # DIMM Slot Outline
        draw.rounded_rectangle([dimm_x, dimm_y1, dimm_x + 26, dimm_y2], radius=4, fill=(18, 20, 28), outline=(48, 54, 70), width=2)
        # Heatspreader texture
        draw.rectangle([dimm_x + 3, dimm_y1 + 25, dimm_x + 23, dimm_y2 - 25], fill=(24, 27, 36), outline=(38, 44, 58))
        # Geometric heatsink grooves
        for gy in range(dimm_y1 + 50, dimm_y2 - 50, 25):
            draw.line([(dimm_x + 5, gy), (dimm_x + 21, gy + 8)], fill=(40, 46, 62), width=2)
        # Gold Contact Pins
        for py in range(dimm_y1 + 30, dimm_y2 - 30, 6):
            draw.line([(dimm_x + 1, py), (dimm_x + 3, py)], fill=(180, 140, 45), width=1)
        # Top RGB / Crimson Lightbar
        rgb_wave = (math.sin(phase * 2 * math.pi + dimm_idx * 1.5) + 1) / 2
        bar_r = int(210 + 45 * rgb_wave)
        bar_g = int(25 + 30 * rgb_wave)
        bar_b = int(40 + 20 * rgb_wave)
        draw.rounded_rectangle([dimm_x + 2, dimm_y1 + 2, dimm_x + 24, dimm_y1 + 18], radius=2, fill=(bar_r, bar_g, bar_b))
        draw.text((dimm_x + 6, dimm_y1 + 75), "DDR5", fill=(80, 90, 110))

    # (E) Flagship Processor / CPU-GPU Die (Center Right)
    sock_w, sock_h = 160, 160
    sock_x1 = cpu_cx - sock_w // 2
    sock_y1 = cpu_cy - sock_h // 2
    sock_x2 = cpu_cx + sock_w // 2
    sock_y2 = cpu_cy + sock_h // 2

    # Outer Retention Frame
    draw.rounded_rectangle([sock_x1, sock_y1, sock_x2, sock_y2], radius=10, fill=(22, 25, 33), outline=(65, 72, 90), width=3)
    # Inner Socket Cavity
    draw.rounded_rectangle([sock_x1 + 12, sock_y1 + 12, sock_x2 - 12, sock_y2 - 12], radius=6, fill=(14, 16, 22), outline=(42, 48, 62), width=2)
    # Torx Screws on 4 corners
    for sx, sy in [(sock_x1 + 8, sock_y1 + 8), (sock_x2 - 8, sock_y1 + 8), (sock_x1 + 8, sock_y2 - 8), (sock_x2 - 8, sock_y2 - 8)]:
        draw.ellipse([sx-4, sy-4, sx+4, sy+4], fill=(70, 75, 90), outline=(35, 40, 50))
        draw.line([(sx-2, sy), (sx+2, sy)], fill=(30, 35, 45), width=1)

    # Silicon IHS (Integrated Heat Spreader)
    ihs_w, ihs_h = 100, 100
    ihs_x1, ihs_y1 = cpu_cx - ihs_w // 2, cpu_cy - ihs_h // 2
    ihs_x2, ihs_y2 = cpu_cx + ihs_w // 2, cpu_cy + ihs_h // 2
    draw.rounded_rectangle([ihs_x1, ihs_y1, ihs_x2, ihs_y2], radius=6, fill=(28, 32, 42), outline=(75, 85, 105), width=2)

    # Micro-architecture Core Die (illuminated pulsing core)
    core_w, core_h = 60, 60
    core_x1, core_y1 = cpu_cx - core_w // 2, cpu_cy - core_h // 2
    core_x2, core_y2 = cpu_cx + core_w // 2, cpu_cy + core_h // 2
    core_pulse_r = int(170 + 85 * pulse_val)
    core_pulse_g = int(20 + 25 * pulse_val)
    core_pulse_b = int(35 + 15 * pulse_val)
    draw.rounded_rectangle([core_x1, core_y1, core_x2, core_y2], radius=4, fill=(35, 15, 20), outline=(core_pulse_r, core_pulse_g, core_pulse_b), width=2)

    # Core internal silicon grid
    for cx in range(core_x1 + 6, core_x2 - 2, 8):
        draw.line([(cx, core_y1 + 4), (cx, core_y2 - 4)], fill=(core_pulse_r // 3, 15, 25), width=1)
    for cy in range(core_y1 + 6, core_y2 - 2, 8):
        draw.line([(core_x1 + 4, cy), (core_x2 - 4, cy)], fill=(core_pulse_r // 3, 15, 25), width=1)

    # Central Core Logo / Symbol
    draw.text((cpu_cx - 24, cpu_cy - 12), "APEX", fill=(255, 255, 255))
    draw.text((cpu_cx - 20, cpu_cy + 2), "V-CACHE", fill=(core_pulse_r, core_pulse_g, core_pulse_b))

    # CPU Corner pin gold marker
    draw.polygon([(sock_x1 + 14, sock_y1 + 14), (sock_x1 + 24, sock_y1 + 14), (sock_x1 + 14, sock_y1 + 24)], fill=(220, 180, 50))

    # 3. Dynamic Animated Signal Packets flowing along circuit traces
    for p_idx, path in enumerate(trace_paths):
        # Calculate total path length
        seg_lens = []
        tot_len = 0.0
        for s in range(len(path) - 1):
            dx = path[s+1][0] - path[s][0]
            dy = path[s+1][1] - path[s][1]
            l = math.sqrt(dx*dx + dy*dy)
            seg_lens.append(l)
            tot_len += l
        if tot_len == 0:
            continue

        # Position along path: staggered by path index
        pkt_progress = (phase + p_idx * 0.137) % 1.0
        target_dist = pkt_progress * tot_len

        # Find current segment and coordinates
        accum = 0.0
        cur_x, cur_y = path[0]
        for s in range(len(seg_lens)):
            if accum + seg_lens[s] >= target_dist:
                rem = target_dist - accum
                ratio = rem / seg_lens[s] if seg_lens[s] > 0 else 0
                cur_x = path[s][0] + ratio * (path[s+1][0] - path[s][0])
                cur_y = path[s][1] + ratio * (path[s+1][1] - path[s][1])
                break
            accum += seg_lens[s]

        # Draw glowing data packet head
        head_color = (255, 60, 75) if (p_idx % 3 != 0) else (255, 180, 60)
        draw.ellipse([cur_x - 3, cur_y - 3, cur_x + 3, cur_y + 3], fill=head_color)
        draw.ellipse([cur_x - 1.5, cur_y - 1.5, cur_x + 1.5, cur_y + 1.5], fill=(255, 255, 255))

    # 4. Subtle sweeping technical laser / telemetry line
    scan_x = int(phase * (W + 200)) - 100
    if 0 <= scan_x <= W:
        draw.line([(scan_x, 0), (scan_x - 80, H)], fill=(220, 30, 45), width=1)
        # Glow next to line
        draw.line([(scan_x + 1, 0), (scan_x - 79, H)], fill=(70, 15, 25), width=2)

    # 5. Smooth left-to-right dark gradient overlay (seamless blending to #0a0a0c)
    # The left 250px smoothly fades to black so the GIF integrates invisibly
    fade_overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fade_draw = ImageDraw.Draw(fade_overlay)
    for fx in range(0, 260):
        # 1.0 at x=0 (completely black), 0.0 at x=260 (fully transparent)
        alpha = int(255 * (1.0 - (fx / 260.0)) ** 1.5)
        fade_draw.line([(fx, 0), (fx, H)], fill=(10, 10, 13, alpha), width=1)
    
    # Also top and bottom subtle 15px vignette
    for fy in range(0, 25):
        alpha = int(220 * (1.0 - (fy / 25.0)))
        fade_draw.line([(0, fy), (W, fy)], fill=(10, 10, 13, alpha), width=1)
        fade_draw.line([(0, H - 1 - fy), (W, H - 1 - fy)], fill=(10, 10, 13, alpha), width=1)
    # Right edge subtle fade
    for rx in range(0, 35):
        alpha = int(200 * (rx / 35.0))
        fade_draw.line([(W - 1 - rx, 0), (W - 1 - rx, H)], fill=(10, 10, 13, 200 - alpha), width=1)

    img = Image.alpha_composite(img.convert('RGBA'), fade_overlay).convert('RGB')
    frames.append(img)

print(f"Generated {len(frames)} frames. Saving GIF...")
# Save optimized GIF
frames[0].save(
    gif_path,
    save_all=True,
    append_images=frames[1:],
    duration=DURATION_MS,
    loop=0,
    optimize=True
)
print(f"Saved GIF to: {gif_path} (Size: {os.path.getsize(gif_path)} bytes)")

# Save WebP for ultra-efficient modern browsers
frames[0].save(
    webp_path,
    save_all=True,
    append_images=frames[1:],
    duration=DURATION_MS,
    loop=0,
    quality=85
)
print(f"Saved WebP to: {webp_path} (Size: {os.path.getsize(webp_path)} bytes)")
