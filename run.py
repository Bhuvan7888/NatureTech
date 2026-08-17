#!/usr/bin/env python
"""
Run script for Re-Grow Active Recovery Application (FastAPI + Next.js Frontend).
"""
import os
import sys
import subprocess
import time

def main():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(dir_path)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--legacy":
        print("Starting Legacy Streamlit UI...")
        subprocess.run([sys.executable, "-m", "streamlit", "run", "deforestation_ui.py"])
        return

    if len(sys.argv) > 1 and sys.argv[1] == "--api":
        print("Starting FastAPI Backend Server on port 8000...")
        subprocess.run([sys.executable, "-m", "uvicorn", "api:app", "--port", "8000", "--host", "0.0.0.0", "--reload"])
        return

    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    print("==================================================")
    print("       Re-Grow Active Recovery Platform           ")
    print("==================================================")
    print("[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
    
    # Launch FastAPI backend
    api_proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "api:app", "--port", "8000", "--host", "0.0.0.0"])
    
    time.sleep(2)

    frontend_dir = os.path.join(dir_path, "frontend")
    print("[2/2] Starting Next.js Frontend on http://localhost:3000 ...")
    
    try:
        subprocess.run("npm run dev", shell=True, cwd=frontend_dir)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
    finally:
        api_proc.terminate()

if __name__ == "__main__":
    main()
 