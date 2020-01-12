let whereBallHits = undefined;

function draw() {
  whereBallHits = renderBrickBreak();
  if (whereBallHits) {
    renderBtree(whereBallHits);
    whereBallHits = undefined;
  }
  requestAnimationFrame(draw);
}
