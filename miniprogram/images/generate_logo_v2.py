#!/usr/bin/env python3
"""
骑行记 Logo 生成器 v2 - 修复 PNG 生成问题
"""

import struct
import zlib

def create_png(width, height, pixels):
    """创建 PNG 文件 - 使用标准方法"""
    
    def png_pack(png_tag, data):
        chunk_head = png_tag + data
        return (struct.pack(">I", len(data)) +
                chunk_head +
                struct.pack(">I", 0xFFFFFFFF & zlib.crc32(chunk_head)))
    
    # PNG 签名
    signature = b"\x89PNG\r\n\x1a\n"
    
    # IHDR 块
    ihdr_data = struct.pack(">2I5B", width, height, 8, 6, 0, 0, 0)
    ihdr = png_pack(b"IHDR", ihdr_data)
    
    # 压缩图像数据
    raw_data = b""
    for y in range(height):
        raw_data += b"\x00"  # filter type none
        for x in range(width):
            raw_data += bytes(pixels[y][x])
    
    compressed = zlib.compress(raw_data, 9)
    idat = png_pack(b"IDAT", compressed)
    
    # IEND 块
    iend = png_pack(b"IEND", b"")
    
    return signature + ihdr + idat + iend

def generate_logo():
    """生成骑行记 logo - 抽象双环设计"""
    width, height = 512, 512
    
    # 初始化像素（透明）
    pixels = [[0, 0, 0, 0] for _ in range(width * height)]
    pixels = [pixels[i*width:(i+1)*width] for i in range(height)]
    
    def draw_circle(cx, cy, r, color, filled=True):
        """绘制圆形"""
        for y in range(max(0, cy - r), min(height, cy + r + 1)):
            for x in range(max(0, cx - r), min(width, cx + r + 1)):
                dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
                if filled:
                    if dist <= r:
                        idx = y * width + x
                        pixels[y][x] = list(color)
                else:
                    if r - 2 <= dist <= r:
                        idx = y * width + x
                        pixels[y][x] = list(color)
    
    def draw_ellipse(cx, cy, rx, ry, color, filled=True):
        """绘制椭圆"""
        for y in range(max(0, cy - ry), min(height, cy + ry + 1)):
            for x in range(max(0, cx - rx), min(width, cx + rx + 1)):
                dx = (x - cx) / rx
                dy = (y - cy) / ry
                dist = (dx * dx + dy * dy) ** 0.5
                if filled:
                    if dist <= 1:
                        pixels[y][x] = list(color)
                else:
                    if 0.85 <= dist <= 1:
                        pixels[y][x] = list(color)
    
    def draw_rounded_rect(x, y, w, h, r, color):
        """绘制圆角矩形背景"""
        for py in range(y, y + h):
            for px in range(x, x + w):
                # 检查是否在圆角矩形内
                dx = 0
                dy = 0
                if px < x + r:
                    dx = x + r - px
                elif px > x + w - r:
                    dx = px - (x + w - r)
                if py < y + r:
                    dy = y + r - py
                elif py > y + h - r:
                    dy = py - (y + h - r)
                
                if dx > 0 and dy > 0:
                    if (dx ** 2 + dy ** 2) ** 0.5 > r:
                        continue
                elif dx > r or dy > r:
                    continue
                
                # 渐变效果
                ratio = (px + py) / (width + height)
                r_val = int(7 * (1 - ratio * 0.1))
                g_val = int(193 * (1 - ratio * 0.1))
                b_val = int(96 * (1 - ratio * 0.1))
                pixels[py][px] = [r_val, g_val, b_val, 255]
    
    # 1. 绘制绿色渐变圆角矩形背景
    draw_rounded_rect(0, 0, width, height, 100, [7, 193, 96])
    
    # 2. 绘制左环（白色椭圆环）
    left_cx = 200
    cy = 256
    draw_ellipse(left_cx, cy, 70, 90, [255, 255, 255, 230], filled=False)
    
    # 3. 绘制右环（金色椭圆环）
    right_cx = 312
    draw_ellipse(right_cx, cy, 70, 90, [255, 215, 0, 210], filled=False)
    
    # 4. 中心连接点（白色实心圆）
    draw_circle(256, 256, 20, [255, 255, 255, 255], filled=True)
    
    # 5. 装饰性高光
    draw_circle(180, 220, 8, [255, 255, 255, 150], filled=True)
    draw_circle(332, 220, 8, [255, 230, 100, 150], filled=True)
    
    return create_png(width, height, pixels)

if __name__ == '__main__':
    print("正在生成 Logo...")
    png_data = generate_logo()
    
    with open('logo.png', 'wb') as f:
        f.write(png_data)
    
    print(f"✅ Logo 已生成：logo.png")
    print(f"📁 文件大小：{len(png_data)} bytes")
