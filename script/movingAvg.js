function movingAverage(data, windowSize) {
    return data.map((row, idx, total) => {
        const start = Math.max(0, idx - windowSize);
        const end = idx;
        const window = total.slice(start, end + 1);
        const avg = window.reduce((sum, row) => sum + row.Total, 0) / window.length;
        return { Year: row.Year, Average: avg };
    });
}
