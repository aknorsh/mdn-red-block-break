const btcanvas = document.getElementById("btree");
let btx = btcanvas.getContext("2d");
let ar = [];


function renderBtree (ipt) {
  btx.clearRect(0, 0, btcanvas.width, btcanvas.height);
  ar.push(ipt);

  ar.map((elm, idx) => {
    btx.font = "16px Arial";
    btx.fillStyle = "#0095FF";
    btx.fillText(elm, 50, 20 * (idx + 1));
  })
}

