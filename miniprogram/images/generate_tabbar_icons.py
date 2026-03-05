#!/usr/bin/env python3
"""
生成 TabBar 图标（81x81）
"""

import struct
import zlib
import math

def create_png(width, height, pixels):
    def png_chunk(chunk_type, data):
        chunk_len = struct.pack('>I', len(data))
        chunk_crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return chunk_len + chunk_type + data + chunk_crc
    
    signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr = png_chunk(b'IHDR', ihdr_data)
    
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            raw_data += bytes(pixels[y][x])
    
    compressed = zlib.compress(raw_data, 9)
    idat = png_chunk(b'IDAT', compressed)
    iend = png_chunk(b'IEND', b'')
    
    return signature + ihdr + idat + iend

def draw_icon(width, height, icon_type, active):
    pixels = [[[255, 255, 255, 0] for _ in range(width)] for _ in range(height)]
    
    if active:
        color = [7, 193, 96]
    else:
        color = [153, 153, 153]
    
    center = width // 2
    
    if icon_type == 'home':
        for y in range(20, 40):
            start = center - (y - 20)
            end = center + (y - 20)
            for x in range(max(0, start), min(width, end + 1)):
                pixels[y][x] = color + [255]
        for y in range(40, 60):
            for x in range(center - 20, center + 21):
                pixels[y][x] = color + [255]
        for y in range(50, 60):
            for x in range(center - 8, center + 9):
                pixels[y][x] = [255, 255, 255, 255] if active else color + [255]
    
    elif icon_type == 'publish':
        bar_width = 8
        for y in range(center - bar_width//2, center + bar_width//2 + 1):
            for x in range(20, width - 20):
                pixels[y][x] = color + [255]
        for x in range(center - bar_width//2, center + bar_width//2 + 1):
            for y in range(20, height - 20):
                pixels[y][x] = color + [255]
    
    elif icon_type == 'mine':
        head_y = 30
        head_r = 12
        for y in range(head_y - head_r, head_y + head_r + 1):
            for x in range(center - head_r, center + head_r + 1):
                dist_sq = (x - center)**2 + (y - head_y)**2
                if dist_sq <= head_r**2:
                    pixels[y][x] = color + [255]
        for y in range(45, 65):
            body_width = int(20 * (1 - (y - 45) / 20))
            for x in range(center - body_width, center + body_width + 1):
                pixels[y][x] = color + [255]
    
    return create_png(width, height, pixels)

if __name__ == '__main__':
    size = 81
    icons = [
        ('home', False),
        ('home', True),
        ('publish', False),
        ('publish', True),
        ('mine', False),
        ('mine', True),
    ]
    
    for icon_type, active in icons:
        if active:
            filename = f'{icon_type}-active.png'
        else:
            filename = f'{icon_type}.png'
        
        png_data = draw_icon(size, size, icon_type, active)
        
        with open(filename, 'wb') as f:
            f.write(png_data)
        
        print(f"Generated: {filename}")
    
    print("Done!")
