import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether

def generate_pdf(filename="ReGrow_Hackathon_Winning_Demo_Script.pdf"):
    pdf_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#064e3b")      # Deep Emerald
    SECONDARY = colors.HexColor("#10b981")    # Bright Emerald Accent
    DARK_BG = colors.HexColor("#0f172a")      # Slate Dark
    TEXT_COLOR = colors.HexColor("#1e293b")   # Slate Body Text
    MUTED = colors.HexColor("#64748b")        # Slate Muted
    LIGHT_BG = colors.HexColor("#f8fafc")     # Light Card BG
    BORDER_COLOR = colors.HexColor("#cbd5e1") # Border Grey

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_COLOR,
        spaceAfter=6
    )

    script_spoken = ParagraphStyle(
        'ScriptSpoken',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=4
    )

    action_cue = ParagraphStyle(
        'ActionCue',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#0284c7"), # Blue action text
        spaceAfter=4
    )

    rubric_tag = ParagraphStyle(
        'RubricTag',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#d97706"), # Amber highlight
        spaceAfter=4
    )

    elements = []

    # Document Header Title Block
    elements.append(Paragraph("🌱 Re-Grow (NatureTech): 4-Minute Hackathon Winning Demo Script", title_style))
    elements.append(Paragraph("Master Pitch Guide & Live Screen Choreography Aligned to Official Judging Rubric", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=12))

    # Judging Rubric Overview Table
    rubric_data = [
        [Paragraph("<b>Judging Criteria</b>", body_style), Paragraph("<b>Weight</b>", body_style), Paragraph("<b>Re-Grow Winning Strategy & Pitch Focus</b>", body_style)],
        [Paragraph("<b>Impact & Problem Fit</b>", body_style), Paragraph("25%", body_style), Paragraph("Translates passive satellite pixels into <b>actionable sapling counts & USD recovery budgets</b>.", body_style)],
        [Paragraph("<b>Technical Execution</b>", body_style), Paragraph("25%", body_style), Paragraph("FastAPI backend, Next.js 15, OpenCV, rasterio, STAC Sentinel-2, Overpass API & SQLite.", body_style)],
        [Paragraph("<b>Usability, Design & Accessibility</b>", body_style), Paragraph("20%", body_style), Paragraph("Glassmorphism dark mode UI, interactive comparison slider, dynamic map, 1-click sample demo.", body_style)],
        [Paragraph("<b>Creativity & Originality</b>", body_style), Paragraph("15%", body_style), Paragraph("Active disaster recovery pipeline + 50km geospatial NGO matchmaker + real-time climate telemetry.", body_style)],
        [Paragraph("<b>Presentation & Demo Quality</b>", body_style), Paragraph("15%", body_style), Paragraph("Flawless live screen choreography, crisp timing, zero-downtime offline fallback defense.", body_style)],
    ]

    t_rubric = Table(rubric_data, colWidths=[130, 45, 365])
    t_rubric.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_rubric)
    elements.append(Spacer(1, 14))

    # SECTION 1: MINUTE 0:00 - 0:45
    elements.append(Paragraph("⏱️ MINUTE 0:00 - 0:45 | Impact & Problem Fit (25% Weight)", h2_style))
    elements.append(Paragraph("<b>Rubric Alignment:</b> Demonstrates real-world crisis, target user clarity, and immediate practical utility.", rubric_tag))
    elements.append(Paragraph("🎬 <b>Live Screen Action:</b> Open <code>http://localhost:3000</code>. Point to the sticky header with <b>API Health Online</b> heartbeat badge and the headline card.", action_cue))
    
    script_m1 = (
        "<b>🗣️ WHAT TO SAY (Word-for-Word Spoken Script):</b><br/>"
        "\"Honorable judges, every year over 10 million hectares of forest are destroyed by deforestation and wildfires. "
        "Today, governments and emergency teams use satellite monitoring to see <i>where</i> trees died. But there is a massive gap: "
        "passive maps leave disaster responders completely stranded—with zero actionable budgets, zero sapling counts, and no local ground team to actually plant trees.<br/><br/>"
        "Introducing <b>Re-Grow</b>—the world's first <b>Active Disaster Recovery Engine</b>. Re-Grow transforms raw satellite imagery "
        "directly into actionable restoration plans. In under 5 seconds, our platform quantifies precise damage area, calculates required saplings "
        "and USD recovery costs, and automatically matches disaster teams with local conservation NGOs in the impact zone!\""
    )
    elements.append(Paragraph(script_m1, script_spoken))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=8, spaceAfter=8))

    # SECTION 2: MINUTE 0:45 - 2:00
    elements.append(Paragraph("⏱️ MINUTE 0:45 - 2:00 | Technical Execution & Usability/Design (45% Weight)", h2_style))
    elements.append(Paragraph("<b>Rubric Alignment:</b> Shows functional Next.js 15 UI, STAC Sentinel-2 live satellite acquisition, and interactive slider UX.", rubric_tag))
    elements.append(Paragraph("🎬 <b>Live Screen Action:</b> Click the <b>📡 Live Sentinel-2 Stream</b> tab. Type <i>'Amazon Rainforest'</i> in the search box, click <b>Locate</b>, then click <b>Fetch Cloud-Free Satellite Data</b>. Show retrieved Sentinel-2 tiles populating the slots.", action_cue))

    script_m2 = (
        "<b>🗣️ WHAT TO SAY (Word-for-Word Spoken Script):</b><br/>"
        "\"Let's see Re-Grow in action. Responders have two options: drag and drop custom high-resolution drone or GeoTIFF files, "
        "or click our <b>Live Sentinel-2 Stream</b> tab. I'll type <i>'Amazon Rainforest'</i> and click Locate.<br/><br/>"
        "In real-time, our Python FastAPI backend queries Microsoft Planetary Computer STAC API across European Space Agency Sentinel-2 satellites. "
        "Notice how it automatically filters for cloud-free tiles and returns baseline historical imagery alongside recent post-disaster satellite imagery.<br/><br/>"
        "Now I click <b>Execute Deforestation Analysis</b>. Our computer vision engine processes normalized greenness index deltas with adaptive statistical thresholding... "
        "and look at this result!\""
    )
    elements.append(Paragraph(script_m2, script_spoken))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=8, spaceAfter=8))

    # SECTION 3: MINUTE 2:00 - 3:00
    elements.append(Paragraph("⏱️ MINUTE 2:00 - 3:00 | Creativity, Originality & Deep Analytics (35% Weight)", h2_style))
    elements.append(Paragraph("<b>Rubric Alignment:</b> Highlights original CV algorithms, reforestation economics, live weather telemetry, and NGO matchmaker.", rubric_tag))
    elements.append(Paragraph("🎬 <b>Live Screen Action:</b> Drag the <b>Interactive Image Comparison Slider</b> left/right. Switch to <b>AI Mask Overlay</b> and click <b>Download Overlay PNG</b>. Point to <b>Live Climate Card</b> and <b>KPI Metrics Cards</b>.", action_cue))

    script_m3 = (
        "<b>🗣️ WHAT TO SAY (Word-for-Word Spoken Script):</b><br/>"
        "\"Here is our side-by-side satellite image comparison slider. Judges can drag the divider to inspect forest loss pixel-by-pixel, "
        "or toggle the <b>AI Mask Overlay</b> highlighting detected damage clusters in bright red.<br/><br/>"
        "Above our KPIs, Re-Grow pulls real-time environmental telemetry from Open-Meteo—showing temperature, wind speed, and wildfire spread risk.<br/><br/>"
        "Now look at the <b>Reforestation Economics Engine</b>: Re-Grow detected 6,018 square meters of destroyed tree cover. "
        "Applying ecological density standards of 1 tree per 4 square meters, it calculates an exact requirement of <b>1,504 saplings</b> "
        "and an estimated recovery budget of <b>$3,761.25</b>!\""
    )
    elements.append(Paragraph(script_m3, script_spoken))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=8, spaceAfter=8))

    # SECTION 4: MINUTE 3:00 - 4:00
    elements.append(Paragraph("⏱️ MINUTE 3:00 - 4:00 | Geospatial Matchmaker, CSV Export & Conclusion", h2_style))
    elements.append(Paragraph("<b>Rubric Alignment:</b> Shows end-to-end completeness, OpenStreetMap Overpass integration, SQLite audit log, and strong closing.", rubric_tag))
    elements.append(Paragraph("🎬 <b>Live Screen Action:</b> Scroll to <b>Geospatial OpenStreetMap Map</b> pin, click <b>Export CSV</b> on the Cluster Table, and show the <b>NGO Partner Grid</b> cards.", action_cue))

    script_m4 = (
        "<b>🗣️ WHAT TO SAY (Word-for-Word Spoken Script):</b><br/>"
        "\"Finally, knowing the budget isn't enough—you need boots on the ground. Re-Grow queries the OpenStreetMap Overpass API "
        "to locate registered forestry offices, environmental non-profits, and nature clubs within a 50km radius of the damage.<br/><br/>"
        "Responders can click <b>Connect & Partner</b> to visit verified websites, export cluster bounding box data via <b>Export CSV</b>, "
        "or view historical runs logged in our SQLite database.<br/><br/>"
        "Re-Grow bridges satellite pixels to real-world saplings planted. Thank you, and we welcome your questions!\""
    )
    elements.append(Paragraph(script_m4, script_spoken))
    elements.append(Spacer(1, 10))

    # SECTION 5: JUDGE Q&A DEFENSE PREPARATION (CRITICAL HACKATHON WINNER DEFENSE)
    elements.append(Paragraph("🛡️ Anticipated Judge Q&A Defense (100% Prepared Answers)", h2_style))

    qa_data = [
        [Paragraph("<b>Judge Question</b>", body_style), Paragraph("<b>Winning Prepared Answer</b>", body_style)],
        [
            Paragraph("<b>Q1: What if the satellite STAC API is offline or slow during a live disaster response?</b>", body_style),
            Paragraph("Re-Grow has a zero-downtime architecture. It includes an in-memory & SQLite cache, an offline fallback dataset of top conservation NGOs, and allows users to upload local GeoTIFF/drone images directly.", body_style)
        ],
        [
            Paragraph("<b>Q2: How accurate is your computer vision damage detection model?</b>", body_style),
            Paragraph("We combine normalized greenness index deltas with adaptive statistical thresholding (&mu; + 1.0&sigma;) and morphological opening/closing to filter out shadows and cloud interference.", body_style)
        ],
        [
            Paragraph("<b>Q3: How is the $2.50 per tree cost benchmark calculated?</b>", body_style),
            Paragraph("It is modeled on global forestry restoration standards: $1.00 for sapling purchasing, $0.75 for land prep and planting labor, and $0.75 for 2-year survival monitoring.", body_style)
        ]
    ]

    t_qa = Table(qa_data, colWidths=[180, 360])
    t_qa.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_qa)

    # Build Document
    doc.build(elements)
    print(f"Successfully generated PDF: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    generate_pdf()
