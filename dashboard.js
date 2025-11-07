// User dropdown menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // Chart toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const chartCanvas = document.getElementById('performanceChart');

    if (chartCanvas && toggleButtons.length > 0) {
        let currentMetric = 'spend';
        let chart = null;

        // Initialize chart
        function initChart(metric) {
            const ctx = chartCanvas.getContext('2d');
            const width = chartCanvas.offsetWidth;
            const height = chartCanvas.offsetHeight;
            chartCanvas.width = width;
            chartCanvas.height = height;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Generate mock data based on metric
            const days = 30;
            const data = generateMockData(metric, days);
            const maxValue = Math.max(...data);

            // Draw chart
            drawChart(ctx, width, height, data, maxValue, metric);
        }

        function generateMockData(metric, days) {
            const data = [];
            const baseValues = {
                spend: 4000,
                clicks: 800,
                conversions: 320
            };
            const base = baseValues[metric] || 4000;

            for (let i = 0; i < days; i++) {
                // Add some variation
                const variation = (Math.random() - 0.5) * 0.4;
                const trend = Math.sin(i / days * Math.PI * 2) * 0.2;
                const value = base * (1 + variation + trend);
                data.push(Math.max(value * 0.5, value));
            }
            return data;
        }

        function drawChart(ctx, width, height, data, maxValue, metric) {
            const padding = { top: 40, right: 40, bottom: 40, left: 60 };
            const chartWidth = width - padding.left - padding.right;
            const chartHeight = height - padding.top - padding.bottom;

            // Draw grid lines
            ctx.strokeStyle = '#E5E7EB';
            ctx.lineWidth = 1;
            const gridLines = 5;
            for (let i = 0; i <= gridLines; i++) {
                const y = padding.top + (chartHeight / gridLines) * i;
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(width - padding.right, y);
                ctx.stroke();
            }

            // Draw Y-axis labels
            ctx.fillStyle = '#6B7280';
            ctx.font = '12px Assistant';
            ctx.textAlign = 'right';
            for (let i = 0; i <= gridLines; i++) {
                const value = maxValue * (1 - i / gridLines);
                const y = padding.top + (chartHeight / gridLines) * i;
                const label = formatValue(value, metric);
                ctx.fillText(label, padding.left - 10, y + 4);
            }

            // Draw X-axis labels (dates)
            ctx.textAlign = 'center';
            const dateInterval = Math.floor(data.length / 5);
            for (let i = 0; i < data.length; i += dateInterval) {
                const x = padding.left + (chartWidth / (data.length - 1)) * i;
                const date = new Date();
                date.setDate(date.getDate() - (data.length - i));
                const label = (date.getDate()) + '/' + (date.getMonth() + 1);
                ctx.fillText(label, x, height - padding.bottom + 20);
            }

            // Draw line
            ctx.strokeStyle = '#4F46E5';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < data.length; i++) {
                const x = padding.left + (chartWidth / (data.length - 1)) * i;
                const y = padding.top + chartHeight - (data[i] / maxValue) * chartHeight;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Draw points
            ctx.fillStyle = '#4F46E5';
            for (let i = 0; i < data.length; i++) {
                const x = padding.left + (chartWidth / (data.length - 1)) * i;
                const y = padding.top + chartHeight - (data[i] / maxValue) * chartHeight;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw area under line
            ctx.fillStyle = 'rgba(79, 70, 229, 0.1)';
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top + chartHeight);
            for (let i = 0; i < data.length; i++) {
                const x = padding.left + (chartWidth / (data.length - 1)) * i;
                const y = padding.top + chartHeight - (data[i] / maxValue) * chartHeight;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(width - padding.right, padding.top + chartHeight);
            ctx.closePath();
            ctx.fill();
        }

        function formatValue(value, metric) {
            if (metric === 'spend') {
                return '₪' + Math.round(value).toLocaleString('he-IL');
            } else if (metric === 'clicks') {
                return Math.round(value).toLocaleString('he-IL');
            } else if (metric === 'conversions') {
                return Math.round(value).toLocaleString('he-IL');
            }
            return Math.round(value).toLocaleString('he-IL');
        }

        // Handle toggle button clicks
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                toggleButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Update chart
                currentMetric = this.getAttribute('data-metric');
                initChart(currentMetric);
            });
        });

        // Initialize chart on load
        initChart(currentMetric);

        // Redraw chart on window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                initChart(currentMetric);
            }, 250);
        });
    }
});


