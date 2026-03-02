# Share TerraPulse

Use one of the methods below so other people can open and use TerraPulse.

## 1) Online Share (GitHub Pages)

This repo now includes an auto-deploy workflow at:
`/.github/workflows/deploy-pages.yml`

Steps:
1. Push this project to a GitHub repository.
2. Make sure your default branch is `main` (or update the workflow branch).
3. In GitHub: `Settings -> Pages -> Build and deployment`
4. Select `GitHub Actions` as the source.
5. Push any commit to `main`.
6. Wait for workflow `Deploy TerraPulse to GitHub Pages` to finish.
7. Open your live URL:
   `https://<your-github-username>.github.io/<repo-name>/`

## 2) Local Network Share (same Wi-Fi/LAN)

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\share-lan.ps1 -Port 8080
```

Then share the printed LAN URL (example: `http://192.168.1.20:8080`) with others on the same network.

## Notes

- This is a static app (`index.html`), no backend required.
- For internet/public access, use method 1 (GitHub Pages).
- For classroom/demo in same network, use method 2.

