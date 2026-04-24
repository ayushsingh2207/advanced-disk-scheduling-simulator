from PIL import Image, ImageDraw, ImageFont
import textwrap

# Image dimensions and setup
width, height = 1600, 2200
background_color = (255, 255, 255)
img = Image.new('RGB', (width, height), background_color)
draw = ImageDraw.Draw(img)

# Colors for different components
colors = {
    'frontend': (173, 216, 230),      # Light blue
    'network': (255, 218, 185),       # Peach puff
    'backend': (240, 128, 128),       # Light coral
    'algorithm': (255, 255, 153),     # Light yellow
    'metrics': (144, 238, 144),       # Light green
    'visualization': (135, 206, 250), # Sky blue
    'error': (255, 192, 203),         # Light pink
    'decision': (255, 250, 205),      # Lemon chiffon
}

def draw_box(x, y, width, box_height, text, color, text_color=(0, 0, 0)):
    """Draw a rounded rectangle box with text"""
    # Draw box
    draw.rectangle([x, y, x + width, y + box_height], fill=color, outline=(0, 0, 0), width=2)
    
    # Draw text (centered)
    lines = text.split('\n')
    line_height = 16
    total_text_height = len(lines) * line_height
    start_y = y + (box_height - total_text_height) // 2
    
    for i, line in enumerate(lines):
        text_bbox = draw.textbbox((0, 0), line)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = x + (width - text_width) // 2
        draw.text((text_x, start_y + i * line_height), line, fill=text_color, font=None)

def draw_arrow(from_x, from_y, to_x, to_y, label=''):
    """Draw an arrow between two points"""
    draw.line([(from_x, from_y), (to_x, to_y)], fill=(0, 0, 0), width=2)
    
    # Draw arrowhead
    if to_y > from_y:  # Arrow pointing down
        draw.polygon([(to_x, to_y), (to_x - 8, to_y - 15), (to_x + 8, to_y - 15)], fill=(0, 0, 0))
    elif to_y < from_y:  # Arrow pointing up
        draw.polygon([(to_x, to_y), (to_x - 8, to_y + 15), (to_x + 8, to_y + 15)], fill=(0, 0, 0))
    
    # Draw label if provided
    if label:
        draw.text((from_x + 10, (from_y + to_y) // 2 - 10), label, fill=(100, 100, 100))

# Starting positions
y_pos = 50
box_width = 250
box_height = 60

# Title
title_text = "Disk Scheduling Simulator - System Flow Diagram"
title_bbox = draw.textbbox((0, 0), title_text)
title_width = title_bbox[2] - title_bbox[0]
title_x = (width - title_width) // 2
draw.text((title_x, y_pos), title_text, fill=(0, 0, 0), font=None)
y_pos += 80

# 1. User Input
draw_box(175, y_pos, box_width, box_height, "👤 User Input", colors['frontend'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 2. Input Panel
draw_box(175, y_pos, box_width, box_height, "📋 Input Panel", colors['frontend'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 3. Mode Selection (Decision)
decision_x, decision_y = 300, y_pos
draw_box(175, y_pos, box_width, box_height, "Select Mode", colors['decision'])
y_pos += 120

# 4. Single vs Compare
draw_arrow(200, decision_y + box_height, 150, y_pos)
draw_box(50, y_pos, 200, box_height, "Single Algorithm\nFCFS/SSTF/SCAN/C-SCAN", colors['frontend'])

draw_arrow(400, decision_y + box_height, 450, y_pos)
draw_box(350, y_pos, 200, box_height, "Compare All\nAlgorithms", colors['frontend'])
y_pos += 120

# 5. Package Request
draw_arrow(150, y_pos - 120, 300, y_pos - 60)
draw_arrow(450, y_pos - 120, 300, y_pos - 60)
draw_box(175, y_pos, box_width, box_height, "Package Request\nTracks, Head Position", colors['frontend'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 6. API Call
draw_box(175, y_pos, box_width, box_height, "POST /api/simulate\nor /api/compare", colors['network'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 7. Backend Server
draw_box(175, y_pos, box_width, box_height, "Backend Express\nServer", colors['backend'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 8. Routes
draw_box(175, y_pos, box_width, box_height, "Scheduling Routes", colors['backend'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 9. Controller
draw_box(175, y_pos, box_width, box_height, "Scheduling Controller", colors['backend'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 10. Validate Input (Decision)
validate_y = y_pos
draw_box(175, y_pos, box_width, box_height, "Validate Input", colors['decision'])
y_pos += 120

# 11. Error path
draw_arrow(200, validate_y + box_height, 100, y_pos, "Invalid")
draw_box(25, y_pos, 150, box_height, "Return Error", colors['error'])
error_y = y_pos
y_pos += 120

# Valid path continues
valid_y = validate_y + box_height
draw_arrow(400, valid_y, 400, y_pos - 60, "Valid")
draw_box(275, y_pos, box_width, box_height, "Select Algorithm\nModule", colors['backend'])
algo_select_y = y_pos
y_pos += 120

# 12. Algorithms (4 branches)
draw_arrow(340, algo_select_y + box_height, 150, y_pos)
draw_box(50, y_pos, 200, box_height, "FCFS\nProcess in Order", colors['algorithm'])
fcfs_y = y_pos

draw_arrow(360, algo_select_y + box_height, 350, y_pos)
draw_box(300, y_pos, 200, box_height, "SSTF\nShortest Seek First", colors['algorithm'])
sstf_y = y_pos

draw_arrow(380, algo_select_y + box_height, 550, y_pos)
draw_box(500, y_pos, 200, box_height, "SCAN\nElevator Sweep", colors['algorithm'])
scan_y = y_pos

draw_arrow(460, algo_select_y + box_height, 750, y_pos)
draw_box(700, y_pos, 200, box_height, "C-SCAN\nCircular Sweep", colors['algorithm'])
cscan_y = y_pos

y_pos += 120

# 13. Compute Seek Sequence (convergence)
draw_arrow(150, fcfs_y + box_height, 300, y_pos - 60)
draw_arrow(400, sstf_y + box_height, 300, y_pos - 60)
draw_arrow(600, scan_y + box_height, 300, y_pos - 60)
draw_arrow(800, cscan_y + box_height, 300, y_pos - 60)

draw_box(175, y_pos, box_width, box_height, "Compute Seek\nSequence", colors['metrics'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 14. Calculate Metrics
draw_box(175, y_pos, box_width, box_height, "Calculate Metrics\nTotal, Average, Variance", colors['metrics'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 15. Package Response
draw_box(175, y_pos, box_width, box_height, "Package JSON\nResponse", colors['metrics'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 16. HTTP Response
draw_box(175, y_pos, box_width, box_height, "HTTP Response\n200 OK", colors['network'])
http_resp_y = y_pos
y_pos += 120

# Error message display (from error path)
draw_arrow(100, error_y + box_height, 300, http_resp_y + box_height + 60)

draw_arrow(300, http_resp_y, 300, y_pos - 60)

# 17. Frontend Receives
draw_box(175, y_pos, box_width, box_height, "Frontend Receives\nData", colors['visualization'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 18. Render Mode (Decision)
render_y = y_pos
draw_box(175, y_pos, box_width, box_height, "Render Mode", colors['decision'])
y_pos += 120

# Single vs Compare view
draw_arrow(200, render_y + box_height, 150, y_pos, "Single")
draw_box(50, y_pos, 200, box_height, "Results Panel\nSingle View", colors['visualization'])
single_view_y = y_pos

draw_arrow(400, render_y + box_height, 450, y_pos, "Compare")
draw_box(350, y_pos, 200, box_height, "Results Panel\nComparison View", colors['visualization'])
compare_view_y = y_pos

y_pos += 120

# 19. Metrics Card (convergence)
draw_arrow(150, single_view_y + box_height, 300, y_pos - 60)
draw_arrow(450, compare_view_y + box_height, 300, y_pos - 60)
draw_box(175, y_pos, box_width, box_height, "Display Metrics\nCard", colors['visualization'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 20. Disk Chart
draw_box(175, y_pos, box_width, box_height, "Disk Chart\nPlot Seek Sequence", colors['visualization'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 21. Visualize
draw_box(175, y_pos, box_width, box_height, "📊 Visualize Head\nMovement Chart", colors['visualization'])
y_pos += 120
draw_arrow(300, y_pos - 120, 300, y_pos - 60)

# 22. Final Results
draw_box(175, y_pos, box_width, box_height, "✅ Present Final\nResults to User", colors['metrics'])
y_pos += 120

# Legend
y_pos += 40
legend_y = y_pos
legend_items = [
    ("FRONTEND", colors['frontend']),
    ("NETWORK", colors['network']),
    ("BACKEND", colors['backend']),
    ("ALGORITHMS", colors['algorithm']),
    ("METRICS", colors['metrics']),
    ("VISUALIZATION", colors['visualization']),
]

legend_x = 100
for item, color in legend_items:
    draw.rectangle([legend_x, legend_y, legend_x + 20, legend_y + 20], fill=color, outline=(0, 0, 0))
    draw.text((legend_x + 30, legend_y), item, fill=(0, 0, 0))
    legend_x += 220

# Save the image
img.save('Disk_Scheduling_Flowchart.png')
print("Flowchart image generated successfully!")
print("File saved as: Disk_Scheduling_Flowchart.png")

