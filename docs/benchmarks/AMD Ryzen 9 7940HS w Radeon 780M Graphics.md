## Benchmark Report
> - CPU: AMD Ryzen 9 7940HS w/ Radeon 780M Graphics     
> - RAM: 31 GB
> - NodeJS Version: v20.10.0
> - Backend Server: 1 core / 1 thread
> - Arguments: 
>   - Count: 1,024
>   - Threads: 4
>   - Simultaneous: 32
> - Total Elapsed Time: 65,004 ms

### Total
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
Total | 1,497 | 1,497 | 1,259.61 | 498.08 | 5 | 2,403

### Endpoints
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
PUT /bbs/articles/:id | 57 | 57 | 1,751.94 | 418.31 | 644 | 2,403
POST /bbs/articles | 500 | 500 | 1,381.34 | 294.88 | 325 | 1,910
PUT /bbs/articles/:articleId/comments/:id | 59 | 59 | 1,353 | 229.72 | 778 | 1,670
POST /bbs/articles/:articleId/comments | 563 | 563 | 1,351.63 | 550.46 | 65 | 2,145
DELETE /bbs/articles/:articleId/comments/:id | 18 | 18 | 1,308.77 | 234.93 | 695 | 1,631
DELETE /bbs/articles/:id | 17 | 17 | 1,095.7 | 261.16 | 728 | 1,586
PATCH /bbs/articles/abridges | 70 | 70 | 1,041.51 | 150.91 | 598 | 1,333
GET /bbs/articles/:articleId/comments/:id | 27 | 27 | 832.25 | 162.04 | 541 | 1,182
GET /bbs/articles/:id | 28 | 28 | 757.35 | 236.67 | 254 | 1,149
PATCH /bbs/articles | 48 | 48 | 725.41 | 354.12 | 164 | 1,330
PATCH /bbs/articles/:articleId/comments | 97 | 97 | 582.44 | 452.08 | 5 | 1,435
GET /monitors/health | 6 | 6 | 387.5 | 180.48 | 33 | 633
GET /monitors/system | 7 | 7 | 272.85 | 198.62 | 34 | 585

### Failures
Method | Path | Count | Success
-------|------|-------|--------