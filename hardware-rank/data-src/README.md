# 分数校准表

把公开评测数据填进 `calibration.csv`，运行 `node scripts/calibrate.mjs` 即可批量回写 `public/data/*.json`，并把对应条目的 `est` 置为 false、`meta.version` +1。

```csv
id,metric,value,source
amd-ryzen-7-9800x3d,cb24_st,138,Cinebench 2024 (TechPowerUp 2024-11)
amd-ryzen-7-9800x3d,cb24_mt,1345,Cinebench 2024
amd-ryzen-7-9800x3d,gaming,100,TPU 1080p avg fps relative
nvidia-rtx-5090,raster,100,TPU 4K relative performance
nvidia-rtx-5080,raster,78,TPU 4K relative performance
```

- 原始值指标（`cb24_st` `cb24_mt` `read_GBs` `write_GBs` `latency_ns` `seq_read` `seq_write` `iops_4k_read` `write_cache_out`）直接写入。
- 相对指标（`gaming` `raster` `rt` `igpu`）按「同品类 + 同 form」池内最大值归一到 100 后写入 `*_rel`，因此同一池要尽量一次填全，否则池内比例失真。
- 单位以你选用的评测源为准，站内只用相对比例；`source` 列仅作记录。
- 先 `--dry` 看应用/跳过条数，再正式写入；随后 `npm run validate` 校验。
