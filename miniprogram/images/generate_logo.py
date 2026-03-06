#!/usr/bin/env python3
"""
骑行记 Logo 生成器
生成 512x512 的 PNG logo（带透明背景圆角）
"""

import base64
import struct
import zlib

def create_png(width, height, pixels):
    """创建 PNG 文件"""
    def png_chunk(chunk_type, data):
        chunk_len = struct.pack('>I', len(data))
        chunk_crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return chunk_len + chunk_type + data + chunk_crc
    
    # PNG 签名
    signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR 块
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    ihdr = png_chunk(b'IHDR', ihdr_data)
    
    # IDAT 块（图像数据）
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # 每行开始的 filter byte
        for x in range(width):
            raw_data += bytes(pixels[y][x])
    
    compressed = zlib.compress(raw_data, 9)
    idat = png_chunk(b'IDAT', compressed)
    
    # IEND 块
    iend = png_chunk(b'IEND', b'')
    
    return signature + ihdr + idat + iend

def generate_logo():
    """生成骑行记 logo"""
    width, height = 512, 512
    center_x, center_y = 256, 256
    
    # 初始化像素数组
    pixels = [[0, 0, 0, 0] for _ in range(width * height)]
    pixels = [pixels[i*width:(i+1)*width] for i in range(height)]
    
    def distance(x, y, cx, cy):
        return ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
    
    def draw_ring(cx, cy, inner_r, outer_r, color, alpha=255):
        """绘制圆环"""
        for y in range(height):
            for x in range(width):
                d = distance(x, y, cx, cy)
                if inner_r <= d <= outer_r:
                    # 渐变效果
                    ratio = (d - inner_r) / (outer_r - inner_r)
                    r = int(color[0] * (1 - ratio * 0.3))
                    g = int(color[1] * (1 - ratio * 0.3))
                    b = int(color[2] * (1 - ratio * 0.3))
                    a = int(alpha * (1 - abs(ratio - 0.5) * 0.3))
                    idx = y * width + x
                    pixels[y][x] = [r, g, b, a]
    
    def draw_filled_circle(cx, cy, r, color):
        """绘制实心圆"""
        for y in range(height):
            for x in range(width):
                if distance(x, y, cx, cy) <= r:
                    idx = y * width + x
                    pixels[y][x] = list(color)
    
    def draw_arc(cx, cy, r, start_angle, end_angle, color, thickness=4):
        """绘制弧线"""
        import math
        for angle in range(int(start_angle * 10), int(end_angle * 10)):
            a = angle / 10
            x1 = int(cx + r * math.cos(a))
            y1 = int(cy + r * math.sin(a))
            for t in range(-thickness//2, thickness//2 + 1):
                for dx in range(-thickness//2, thickness//2 + 1):
                    if 0 <= x1+dx < width and 0 <= y1+t < height:
                        pixels[y1+t][x1+dx] = list(color)
    
    # 1. 绘制绿色渐变背景（圆角矩形效果）
    bg_color = [7, 193, 96]  # #07c160
    bg_color2 = [6, 173, 86]  # #06ad56
    for y in range(height):
        for x in range(width):
            # 圆角矩形
            corner_radius = 100
            dx = 0
            dy = 0
            if x < corner_radius:
                dx = corner_radius - x
            elif x > width - corner_radius:
                dx = x - (width - corner_radius)
            if y < corner_radius:
                dy = corner_radius - y
            elif y > height - corner_radius:
                dy = y - (height - corner_radius)
            
            if dx > 0 or dy > 0:
                d = (dx**2 + dy**2) ** 0.5
                if d > corner_radius:
                    continue
            
            # 渐变
            ratio = (x + y) / (width + height)
            r = int(bg_color[0] * (1 - ratio * 0.1))
            g = int(bg_color[1] * (1 - ratio * 0.1))
            b = int(bg_color[2] * (1 - ratio * 0.1))
            pixels[y][x] = [r, g, b, 255]
    
    # 2. 绘制左环（白色）
    left_center_x = center_x - 76
    draw_ring(left_center_x, center_y, 60, 90, [255, 255, 255], 220)
    
    # 3. 绘制右环（金色）
    right_center_x = center_x + 76
    draw_ring(right_center_x, center_y, 60, 90, [255, 215, 0], 200)
    
    # 4. 中心连接点（白色）
    draw_filled_circle(center_x, center_y, 18, [255, 255, 255])
    
    # 5. 装饰弧线
    import math
    # 左环内弧线
    for i in range(30):
        angle = math.pi * 0.4 + i * 0.05
        x = int(left_center_x + 75 * math.cos(angle))
        y = int(center_y + 75 * math.sin(angle))
        if 0 <= x < width and 0 <= y < height:
            pixels[y][x] = [7, 193, 96, 180]
            pixels[y][x+1] = [7, 193, 96, 180]
    
    # 右环内弧线
    for i in range(30):
        angle = math.pi * 0.6 + i * 0.05
        x = int(right_center_x + 75 * math.cos(angle))
        y = int(center_y + 75 * math.sin(angle))
        if 0 <= x < width and 0 <= y < height:
            pixels[y][x] = [255, 165, 0, 180]
            pixels[y][x+1] = [255, 165, 0, 180]
    
    # 6. 添加文字"骑行记"（简单像素字体）
    # 由于像素字体复杂，这里用简单方式：在底部添加三个小圆点代表文字
    text_y = 400
    for i, x_pos in enumerate([220, 256, 292]):
        draw_filled_circle(x_pos, text_y, 12, [255, 255, 255, 200])
    
    return create_png(width, height, pixels)

if __name__ == '__main__':
    png_data = generate_logo()
    
    # 保存为文件
    with open('logo.png', 'wb') as f:
        f.write(png_data)
    
    print("✅ Logo 已生成：logo.png (512x512)")
    print("📁 位置：/root/.openclaw/workspace/ride-together/miniprogram/images/logo.png")
