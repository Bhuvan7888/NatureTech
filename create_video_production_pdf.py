import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether

def generate_video_pdf(filename="ReGrow_Demo_Video_Production_Script.pdf"):
    pdf_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=32,
        leftMargin=32,
        topMargin=32,
        bottomMargin=32
    )

    styles = getSampleStyleSheet()

    # Colors
    PRIMARY = colors.HexColor("#064e3b")      # Deep Emerald
    SECONDARY = colors.HexColor("#10b981")    # Bright Emerald
    BLUE_CUE = colors.HexColor("#0284c7")     # Cue Blue
    AMBER_TEXT = colors.HexColor("#b45309")   # Text Overlay Amber
    TEXT_COLOR = colors.HexColor("#0f172a")   # Dark Body
    LIGHT_BG = colors.HexColor("#f8fafc")     # Light Card BG
    BORDER_COLOR = colors.HexColor("#cbd5e1") # Slate Border

    # Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=SECONDARY,
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=TEXT_COLOR,
        spaceAfter=4
    )

    vo_style = ParagraphStyle(
        'VOScript',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#064e3b"),
        spaceAfter=4
    )

    cue_style = ParagraphStyle(
        'VisualCue',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11.5,
        textColor=BLUE_CUE,
        spaceAfter=3
    )

    overlay_style = ParagraphStyle(
        'TextOverlay',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=AMBER_TEXT,
        spaceAfter=3
    )

    elements = []

    # Title & Header Block
    elements.append(Paragraph("🎬 Re-Grow: 4-Minute Demo Video Teleprompter & Production Script", title_style))
    elements.append(Paragraph("Complete Video Creator Guide: Exact Voiceover Timings, Screen Mouse Choreography & Text Overlays", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=10))

    # Pre-Recording Checklist Table
    checklist_data = [
        [Paragraph("<b>Pre-Recording Setup Checklist</b>", body_style), Paragraph("<b>Target Setting / Action</b>", body_style)],
        [Paragraph("<b>Screen Resolution & Browser Zoom</b>", body_style), Paragraph("1080p (1920x1080) at <b>110% Browser Zoom</b> for maximum legibility.", body_style)],
        [Paragraph("<b>Local Server Execution</b>", body_style), Paragraph("Run <code>python run.py</code> in terminal. Verify API status badge is <b>Green (Online)</b>.", body_style)],
        [Paragraph("<b>Microphone & Audio Settings</b>", body_style), Paragraph("Use clean noise-canceling mic. Pace speech at <b>~130-140 words per minute</b>.", body_style)],
        [Paragraph("<b>Browser Mouse Pointer</b>", body_style), Paragraph("Enable smooth cursor highlighting. Avoid erratic mouse jitter during recording.", body_style)]
    ]
    t_check = Table(checklist_data, colWidths=[160, 380])
    t_check.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_check)
    elements.append(Spacer(1, 10))

    # SCENE 1: 0:00 - 0:35
    elements.append(Paragraph("🎥 SCENE 1: The Crisis & Hook (0:00 - 0:35)", h2_style))
    elements.append(Paragraph("🎬 <b>SCREEN ACTION:</b> Start on Re-Grow Hero page (<code>http://localhost:3000</code>). Slowly pan down over headline & metric pill badges.", cue_style))
    elements.append(Paragraph("🏷️ <b>ON-SCREEN TEXT OVERLAY:</b> <code>DISASTER MONITORING IS BROKEN → RE-GROW: FROM PIXELS TO SAPLINGS</code>", overlay_style))
    vo_1 = (
        "<b>🎙️ EXACT VOICEOVER SCRIPT:</b><br/>"
        "\"Every single year, over 10 million hectares of forest are destroyed by deforestation and intense wildfires.<br/>"
        "Current disaster tools only show satellite maps of <i>where</i> trees died. But passive maps leave recovery teams stranded—with zero actionable budgets, zero sapling counts, and no local ground partners.<br/>"
        "Meet <b>Re-Grow</b>—an Active Disaster Recovery Platform that transforms raw satellite pixels directly into budgeted, actionable restoration plans in under 5 seconds!\""
    )
    elements.append(Paragraph(vo_1, vo_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=6, spaceAfter=6))

    # SCENE 2: 0:35 - 1:15
    elements.append(Paragraph("🎥 SCENE 2: Live Sentinel-2 STAC Acquisition (0:35 - 1:15)", h2_style))
    elements.append(Paragraph("🎬 <b>SCREEN ACTION:</b> Click <b>📡 Live Sentinel-2 Stream</b> tab. Type <i>'Amazon Rainforest'</i> in search bar, click <b>Locate</b>, then click <b>Fetch Cloud-Free Satellite Data</b>.", cue_style))
    elements.append(Paragraph("🏷️ <b>ON-SCREEN TEXT OVERLAY:</b> <code>LIVE ESA SENTINEL-2 STAC API: Automating Cloud-Free Tile Fetching</code>", overlay_style))
    vo_2 = (
        "<b>🎙️ EXACT VOICEOVER SCRIPT:</b><br/>"
        "\"Responders can upload custom drone GeoTIFFs, or use our <b>Live Sentinel-2 Stream</b>. I'll search <i>'Amazon Rainforest'</i> and click Locate.<br/>"
        "Our Python FastAPI backend connects to Microsoft Planetary Computer STAC API across European Space Agency Sentinel-2 satellites. "
        "It automatically filters for cloud-free tiles and loads baseline historical imagery alongside recent post-disaster satellite tiles.<br/>"
        "Now, I'll click <b>Execute Deforestation Analysis</b>!\""
    )
    elements.append(Paragraph(vo_2, vo_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=6, spaceAfter=6))

    # SCENE 3: 1:15 - 2:00
    elements.append(Paragraph("🎥 SCENE 3: Computer Vision & AI Damage Heatmap (1:15 - 2:00)", h2_style))
    elements.append(Paragraph("🎬 <b>SCREEN ACTION:</b> Page smooth scrolls to <b>Comparison Slider</b>. Drag handle left/right. Toggle <b>AI Mask Overlay</b>. Click <b>Download Overlay PNG</b>.", cue_style))
    elements.append(Paragraph("🏷️ <b>ON-SCREEN TEXT OVERLAY:</b> <code>COMPUTER VISION ENGINE: Normalized Greenness Index (ΔG) + Adaptive Thresholding</code>", overlay_style))
    vo_3 = (
        "<b>🎙️ EXACT VOICEOVER SCRIPT:</b><br/>"
        "\"Our computer vision engine computes normalized greenness index deltas with adaptive statistical thresholding to isolate deforested clusters.<br/>"
        "On our <b>Interactive Satellite Comparison Slider</b>, responders can drag the divider to inspect forest loss pixel-by-pixel, "
        "or switch to <b>AI Mask Overlay</b> to view detected damage highlighted in red. We can even download high-resolution visualization PNGs instantly!\""
    )
    elements.append(Paragraph(vo_3, vo_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=6, spaceAfter=6))

    # SCENE 4: 2:00 - 2:45
    elements.append(Paragraph("🎥 SCENE 4: Reforestation Economics & Live Telemetry (2:00 - 2:45)", h2_style))
    elements.append(Paragraph("🎬 <b>SCREEN ACTION:</b> Hover over <b>Live Climate Telemetry Card</b> (Temperature, Wind Speed, Fire Spread Risk) $\rightarrow$ Hover over <b>KPI Metrics Grid Cards</b>.", cue_style))
    elements.append(Paragraph("🏷️ <b>ON-SCREEN TEXT OVERLAY:</b> <code>REFORESTATION ECONOMICS: 1 Tree / 4m² | $2.50 per Sapling Benchmark</code>", overlay_style))
    vo_4 = (
        "<b>🎙️ EXACT VOICEOVER SCRIPT:</b><br/>"
        "\"Above our metrics, Re-Grow streams real-time environmental telemetry from Open-Meteo—monitoring temperature, wind speed, and fire spread risk.<br/>"
        "Here is the core breakthrough: Re-Grow detected 6,018 square meters of lost forest. "
        "Applying global ecological density standards of 1 tree per 4 square meters, it calculates an exact requirement of <b>1,504 saplings</b> "
        "and an estimated recovery budget of <b>$3,761.25</b>!\""
    )
    elements.append(Paragraph(vo_4, vo_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=6, spaceAfter=6))

    # SCENE 5: 2:45 - 3:30
    elements.append(Paragraph("🎥 SCENE 5: Geospatial NGO Matchmaker & CSV Export (2:45 - 3:30)", h2_style))
    elements.append(Paragraph("🎬 <b>SCREEN ACTION:</b> Scroll to OpenStreetMap location pin $\rightarrow$ Click <b>Export CSV</b> on Regions Table $\rightarrow$ Hover over <b>NGO Partner Cards</b>.", cue_style))
    elements.append(Paragraph("🏷️ <b>ON-SCREEN TEXT OVERLAY:</b> <code>GEOSPATIAL MATCHMAKER: OpenStreetMap Overpass API 50km Query</code>", overlay_style))
    vo_5 = (
        "<b>🎙️ EXACT VOICEOVER SCRIPT:</b><br/>"
        "\"Money alone doesn't plant trees—you need local boots on the ground. Re-Grow queries OpenStreetMap Overpass API "
        "to find registered forestry offices, nature clubs, and environmental non-profits within 50km of the damage.<br/>"
        "Responders can click <b>Connect & Partner</b> to visit verified websites, export cluster bounding box data via <b>Export CSV</b>, "
        "or view past runs in our SQLite database!\""
    )
    elements.append(Paragraph(vo_5, vo_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=6, spaceAfter=6))

    # SCENE 6: 3:30 - 4:00
    elements.append(Paragraph("🎥 SCENE 6: Tech Architecture & Conclusion (3:30 - 4:00)", h2_style))
    elements.append(Paragraph("🎬 <b>SCREEN ACTION:</b> Show Next.js 15 + FastAPI architecture diagram / GitHub repo screen $\rightarrow$ End card with Re-Grow branding.", cue_style))
    elements.append(Paragraph("🏷️ <b>ON-SCREEN TEXT OVERLAY:</b> <code>Re-Grow: Next.js 15 | FastAPI | Sentinel-2 | OpenStreetMap</code>", overlay_style))
    vo_6 = (
        "<b>🎙️ EXACT VOICEOVER SCRIPT:</b><br/>"
        "\"Built with Next.js 15, FastAPI, OpenCV, and OpenStreetMap, Re-Grow turns satellite pixels into real saplings planted.<br/>"
        "Thank you for watching, and let's re-grow our planet together!\""
    )
    elements.append(Paragraph(vo_6, vo_style))

    doc.build(elements)
    print(f"Successfully generated Video Teleprompter PDF: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    generate_video_pdf()
