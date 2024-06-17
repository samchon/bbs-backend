## Benchmark Report
> - CPU: AMD Ryzen 9 7940HS w/ Radeon 780M Graphics     
> - RAM: 31 GB
> - NodeJS Version: v20.10.0
> - Backend Server: 1 core / 1 thread
> - Arguments: 
>   - Count: 1,024
>   - Threads: 4
>   - Simultaneous: 32
> - Total Elapsed Time: 57,093 ms

### Total
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
Total | 1,292 | 1,241 | 1,326.44 | 553.62 | 5 | 2,323

### Endpoints
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
PUT /bbs/articles/:id | 41 | 36 | 1,742.39 | 491.91 | 569 | 2,278
POST /bbs/articles/:articleId/comments | 358 | 358 | 1,573.24 | 635.09 | 62 | 2,323
PUT /bbs/articles/:articleId/comments/:id | 37 | 28 | 1,448.91 | 273.66 | 797 | 2,247
POST /bbs/articles | 554 | 554 | 1,418.48 | 340.03 | 114 | 2,007
DELETE /bbs/articles/:id | 18 | 13 | 1,344.55 | 253.43 | 802 | 1,644
DELETE /bbs/articles/:articleId/comments/:id | 19 | 10 | 1,292.05 | 260.36 | 575 | 1,621
GET /bbs/articles/:articleId/comments/:id | 24 | 14 | 891.79 | 168.01 | 577 | 1,195
GET /bbs/articles/:id | 28 | 15 | 861.89 | 248.22 | 175 | 1,229
PATCH /bbs/articles | 80 | 80 | 811.36 | 382.63 | 5 | 1,474
PATCH /bbs/articles/abridges | 56 | 56 | 806.35 | 404.42 | 62 | 1,467
PATCH /bbs/articles/:articleId/comments | 59 | 59 | 471.76 | 362.03 | 5 | 1,595
GET /monitors/system | 13 | 13 | 453.38 | 370.27 | 38 | 1,435
GET /monitors/health | 5 | 5 | 316.39 | 275.76 | 40 | 703

### Failures
Method | Path | Count | Success
-------|------|-------|--------
PUT | /bbs/articles/:id | 41 | 36
PUT | /bbs/articles/:articleId/comments/:id | 37 | 28
GET | /bbs/articles/:id | 28 | 15
GET | /bbs/articles/:articleId/comments/:id | 24 | 14
DELETE | /bbs/articles/:articleId/comments/:id | 19 | 10
DELETE | /bbs/articles/:id | 18 | 13