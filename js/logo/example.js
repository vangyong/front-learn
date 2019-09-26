var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	//清除按钮
	eraseAllButton = document.getElementById('eraseAllButton'),
	//描边颜色
	strokeStyleSelect = document.getElementById('strokeStyleSelect'),
	//画多边形的开始角度
	startAngleSelect = document.getElementById('startAngleSelect'),
	//填充颜色
	fillStyleSelect = document.getElementById('fillStyleSelect'),
	//不否填充
	fillCheckbox = document.getElementById('fillCheckbox'),
	//进入编辑
	editCheckbox = document.getElementById('editCheckbox'),
	//边数
	sidesSelect = document.getElementById('sidesSelect'),
	//canvas位图数据
	drawingSurfaceImageData,
	//记录鼠标按下的位置
	mousedown = {},
	//橡皮筋矩形框
	rubberbandRect = {},
	dragging = false, //是否在拖动状态
	draggingOffsetX,
	draggingOffsetY,
	sides = 8,
	startAngle = 0,
	guidewires = true,
	editing = false,
	//保存已绘制的多边形
	polygons = [];
// Functions..........................................................
//画网络线
function drawGrid(color, stepx, stepy) {
	context.save()
	context.shadowColor = undefined;
	context.shadowBlur = 0;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.strokeStyle = color;
	context.fillStyle = '#ffffff';
	context.lineWidth = 0.5;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.beginPath();
	for(var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
		context.moveTo(i, 0);
		context.lineTo(i, context.canvas.height);
	}
	context.stroke();
	context.beginPath();
	for(var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
		context.moveTo(0, i);
		context.lineTo(context.canvas.width, i);
	}
	context.stroke();
	context.restore();
}
//窗口坐标转canvas坐标
function windowToCanvas(x, y) {
	var bbox = canvas.getBoundingClientRect();
	return {
		x: x - bbox.left * (canvas.width / bbox.width),
		y: y - bbox.top * (canvas.height / bbox.height)
	};
}
// 保存或恢复已绘制的画面...................................
function saveDrawingSurface() {
	drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
	context.putImageData(drawingSurfaceImageData, 0, 0);
}
// 画多边形.....................................................
function drawPolygon(polygon) {
	context.beginPath();
	polygon.createPath(context);
	polygon.stroke(context);
	if(fillCheckbox.checked) {
		polygon.fill(context);
	}
}
// 更新橡皮筋矩形框...................................................
function updateRubberbandRectangle(loc) {
	rubberbandRect.width = Math.abs(loc.x - mousedown.x);
	rubberbandRect.height = Math.abs(loc.y - mousedown.y);
	if(loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
	else rubberbandRect.left = loc.x;
	if(loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
	else rubberbandRect.top = loc.y;
}
//以鼠标按下点为圆心，橡皮筋框宽为半径创建多边形
function drawRubberbandShape(loc, sides, startAngle) {
	var polygon = new Polygon(mousedown.x, mousedown.y,
		rubberbandRect.width,
		parseInt(sidesSelect.value),
		(Math.PI / 180) * parseInt(startAngleSelect.value),
		context.strokeStyle,
		context.fillStyle,
		fillCheckbox.checked);
	drawPolygon(polygon); //画多边形
	if(!dragging) { //保存这个多边形
		polygons.push(polygon);
	}
}
//更新橡皮筋
function updateRubberband(loc, sides, startAngle) {
	updateRubberbandRectangle(loc);
	drawRubberbandShape(loc, sides, startAngle);
}
// 网络线.................................................
function drawHorizontalLine(y) {
	context.beginPath();
	context.moveTo(0, y + 0.5);
	context.lineTo(context.canvas.width, y + 0.5);
	context.stroke();
}

function drawVerticalLine(x) {
	context.beginPath();
	context.moveTo(x + 0.5, 0);
	context.lineTo(x + 0.5, context.canvas.height);
	context.stroke();
}

function drawGuidewires(x, y) {
	context.save();
	context.strokeStyle = 'rgba(0,0,230,0.4)';
	context.lineWidth = 0.5;
	drawVerticalLine(x);
	drawHorizontalLine(y);
	context.restore();
}
//绘制保存的所有多边形
function drawPolygons() {
	polygons.forEach(function(polygon) {
		drawPolygon(polygon);
	});
}