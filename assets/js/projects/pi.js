'use strict';

const _Colors = {
    Cols: ["#112d4e", "#112d4e", "#dbe2ef"],
    Bg: ["#f9f7f7", "#dbe2ef", "#3f72af"]
}

var ArchimedesInput = document.getElementById('archimedes-input');
var ArchimedesReceive = document.getElementById('archimedes-receive');
var archimedescanvas = document.getElementById('archimedes-canvas');
var a_ctx = archimedescanvas.getContext('2d');
var archimedes_div = document.getElementById('method-archimedes');
var archimedescanvas2 = document.getElementById('archimedes-canvas-2');
var a2_ctx = archimedescanvas2.getContext('2d');
var ArchimedesInput2 = document.getElementById('archimedes-input-2');
var ArchimedesReceive2 = document.getElementById('archimedes-receive-2');
var oldArchimedesN = 12;

var LeibnizInput = document.getElementById('leibniz-input');
var LeibnizReceive = document.getElementById('leibniz-receive');
var Leibniz_div = document.getElementById('method-leibniz');

var RamanujanInput = document.getElementById('ramanujan-input');
var RamanujanReceive = document.getElementById('ramanujan-receive');
var Ramanujan_div = document.getElementById('method-ramanujan');

var CollisionInput = document.getElementById('collision-input');
var CollisionBtn = document.getElementById('collision-start');
var CollisionReceive = document.getElementById('collision-receive');
var CollisionCanvas = document.getElementById('collision-canvas');
var Collision_div = document.getElementById('method-collisions');
var ctx = CollisionCanvas.getContext('2d');
var total = new Decimal(0);
var steps = new Decimal(0);
var block1, block2;
var currentPi = new Decimal(0);
var defauldDecimalJsPi = Decimal.acos(-1);
var PiCollideBlock = class PiCollideBlock {
    /**
     * 
     * @param {Decimal | number} x 
     * @param {Decimal | number} w
     * @param {Decimal | number} m
     * @param {Decimal | number} v
     * @param {Decimal | number} xc
     */
    constructor(x, w, m, v, xc)
    {
        this.x = typeof x === 'number' ? new Decimal(x) : x;
        this.y = Decimal.sub(CollisionCanvas.height, w);
        this.w = typeof w === 'number' ? new Decimal(w) : w;
        this.v = typeof v === 'number' ? new Decimal(v) : v;
        this.m = typeof m === 'number' ? new Decimal(m) : m;
        this.xvarraint = typeof xc === 'number' ? new Decimal(xc) : xc;
    }
  
    get hitWall()
    {
        //return this.x <= 0;
        return this.x.lessThan(0);
    }
    get xw() {
        return this.x.plus(this.w);
    }
    reverse()
    {
        this.v = this.v.times(-1);
    }
    /**
     * 
     * @param {Block} other 
     */
    collide(other)
    {
        return !(this.xw.lessThan(other.x) ||
            other.xw.lessThan(this.x));
    }
    /**
     * 
     * @param {Block} other 
     */
    bounce(other)
    {
        const sumM = this.m.plus(other.m);
        return new Decimal(
            this.m.minus(other.m).dividedBy(sumM).times(this.v).plus(
                other.m.times(2).dividedBy(sumM).times(other.v)));
    }
  
    update()
    {
        this.x = this.x.plus(this.v);
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    show(ctx)
    {
        ctx.fillStyle = _Colors.Cols[0];
        ctx.fillRect(
            this.x.toNumber() + 10, this.y.toNumber(),
            this.w.toNumber(), this.w.toNumber());
    }
}

var RandomInput = document.getElementById('random-input');
var RandomReset = document.getElementById('random-reset');
var RandomSelect = document.getElementById('random-function-select');
var RandomReceive = document.getElementById('random-receive');
var RandomReceiveCanvas = document.getElementById('random-canvas-1');
var RandomCtx = RandomReceiveCanvas.getContext('2d');
var Random_div = document.getElementById('method-random');
var RandomBtn = document.getElementById('random-btn');
var RandomTotal = document.getElementById('random-total');

//30 digits of pi, after the decimal point
const PI_30_DIGITS = ['1415926535', '8979323846', '2643383279'].join('')

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} n 
 */
function DrawCircleAndPolygon(canv, ctx, n)
{
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = _Colors.Bg[1];
    ctx.strokeStyle = _Colors.Bg[1];
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(canv.width / 2, canv.height / 2, canv.width / 2 - 1, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    DrawPolygon(canv, ctx, n);
}
function PiArchimedeRecursive(r, n)
{
    const R = typeof r === 'number' ? new Decimal(r) : r;
    if (n <= 6 || n % 2 !== 0)
        return R;
    const L = PiArchimedeRecursive(R, n / 2);
    return (
        R.minus(
            (R.pow(2).minus((L.dividedBy(2)).pow(2))).sqrt())).times(2).times(R).sqrt();
    //return Math.sqrt(
    //    2 * r * r
    //    - 2 * r * Math.sqrt(r * r - L * L / 4));
}
/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} n 
 */
function DrawPolygon(canv, ctx, n)
{
    ctx.beginPath();
    ctx.moveTo(canv.width, canv.height / 2);
    ctx.strokeStyle = _Colors.Cols[1];
    ctx.lineWidth = 2.5;
    const angleI = 2 * Math.PI / n;
    for (let angle = angleI; angle < 2 * Math.PI; angle += angleI)
    {
        ctx.lineTo(
            (Math.cos(angle) + 1) * canv.width / 2,
            (Math.sin(-angle) + 1) * canv.height / 2);
    }
    ctx.lineTo(canv.width, canv.height / 2);
    ctx.stroke();
    ctx.closePath();
}
function factorial(num) {
    var n = new Decimal(1);
    if (num < 2) 
        return n;
    for (var k = 2; k <= num; n = n.times(k++)) {;};
    return n;
}
function gcd(a, b)
{
    let c = a.minus(b);
    while (c.comparedTo(0) !== 0) {
        if (c.isPositive()) {
            a = a.dividedBy(c);
        } else {
            b = b.dividedBy(c.negated());
        }
        c = a.minus(b);
    }
    return a;
}
function CoPrime(a, b)
{
    return gcd(a, b).equals(1);
}
var RandomGeneratorMethods = {
    'default': () => new Decimal(Math.random()),
    'decimalJS': () => Decimal.random()
};

var Pi = {
    CheckUserInput(input) {
        input.value = Math.min(
            input.value,
            input.max);
        input.value = Math.max(
            input.value,
            input.min);
        return Number(input.value);
    },
    async Archimedes() {
        return new Promise(() => {
            let n = Math.floor(Pi.CheckUserInput(ArchimedesInput));
            if (n > 2) {
                ArchimedesReceive.innerHTML = Decimal.sin(
                    defauldDecimalJsPi.dividedBy(n)).times(n).toSD(8).toString();
                DrawCircleAndPolygon(archimedescanvas, a_ctx, n);
            }
        });
    },
    async Archimedes2(evt) {
        if (evt) {
            evt.preventDefault();
        }
        let n = Number(ArchimedesInput2.value);
        await new Promise(() => {
            ArchimedesReceive2.innerHTML =
                PiArchimedeRecursive(0.5, n).times(n).toSD(8).toString();
            DrawCircleAndPolygon(archimedescanvas2, a2_ctx, n);
        });
    },
    LeibnizStarted: false,
    async Leibniz() {
        if (Pi.LeibnizStarted)
            return;
        let n = Math.floor(Pi.CheckUserInput(LeibnizInput));
        LeibnizReceive.innerHTML = '...';
        Pi.LeibnizStarted = true;
        const One = new Decimal(1);
        let pi1, pi2;
        function IterateOdd() {
            let p = new Decimal(1);
            for (let k = 1; k < n; k += 2) {
                const T = One.dividedBy(new Decimal(2 * k + 1));
                p = p.minus(T);
            }
            //console.log('Odd: ' + p.toSD(30).toString());
            return p;
        }
        function IterateEven() {
            let p = new Decimal(0);
            for (let k = 2; k < n; k += 2) {
                const T = One.dividedBy(new Decimal(2 * k + 1));
                p = p.plus(T);
            }
            //console.log('Even: ' + p.toSD(30).toString());
            return p;
        }
        await RunParallel([
            () => { pi1 = IterateOdd(); },
            () => { pi2 = IterateEven(); }
        ]);
        LeibnizReceive.innerHTML = (pi1.plus(pi2)).times(4).toSD(30).toString();
        Pi.LeibnizStarted = false;
    },
    RamanujanStarted: false,
    async Ramanujan()
    {
        if (Pi.RamanujanStarted) {
            return;
        }
        Pi.RamanujanStarted = true;
        const n = Math.floor(Pi.CheckUserInput(RamanujanInput));
        console.log('Ramanujan(' + n + ')');
        requestAnimationFrame(() => {
            RamanujanReceive.innerHTML = '...';
        });
        const oldP = Decimal.precision;
        Decimal.set({ precision: 5 * n });
        const med = Math.floor(n / 2);
        function Iteration(start, end) {
            let p = new Decimal(0);
            for (var k = start; k < end; k++) {
                const Mk = Decimal(factorial(6 * k)).div(Decimal(factorial(3 * k)).times(Decimal(factorial(k)).pow(3)));
                const Lk = Decimal(545140134).times(k).plus(13591409);
                const Xk = Decimal(-262537412640768000).pow(k);
                p = p.plus(Mk.times(Lk).div(Xk));
            }
            return p;
        }
        let blocks = await RunParallel([
            () => Iteration(0, med),
            () => Iteration(med, n)
        ]);
        const C = Decimal(1).div(Decimal(426880).times(Decimal(10005).sqrt()));
        let p = Decimal(1).div(C.times(
            blocks[0].plus(blocks[1])
        ));
        p = p.toSD(30);
        requestAnimationFrame(() => {
            RamanujanReceive.innerHTML = p.toString();
        });
        Pi.RamanujanStarted = false;
        Decimal.set({ precision: oldP });
    },
    collisionsRunning: false,
    collisionDelay: 10,
    collisionDelaysArray: {
        2: 5,
        3: 7,
        4: 7, 
        5: 8,
        6: 10,
        7: 15
    },
    Collision() {//Start or stop
        Pi.collisionsRunning = !Pi.collisionsRunning;
        const digits = Math.floor(Pi.CheckUserInput(CollisionInput));
        if (this.collisionsRunning) {
            //start (was stopped before)
            CollisionBtn.innerHTML = 'Abort';
            currentPi = new Decimal(0);
            steps = Decimal.pow(10, digits - 1);
            block1 = new PiCollideBlock(100, 20, 1, 0, 0);
            block2 = new PiCollideBlock(300, 100, steps.pow(2), new Decimal(-1).dividedBy(steps), 20);
            Pi.collisionDelay = Pi.collisionDelaysArray[digits];
            //start animations
            requestAnimationFrame(Pi.CollisionShow);
            Pi.CollisionsUpdate().then(() => {
                CollisionBtn.innerHTML = 'Start';
            });
        }
    },
    async CollisionsUpdate() {
        if (!Pi.collisionsRunning) {
            return;
        }
        const stepPart = steps.div(10);
        //split in 10 blocks of step/10 operations
        async function RunBlock(count) {
            return await new Promise(res => {
                for (let i = 0; count.greaterThan(i); i++) {
                    if (block1.collide(block2)) {
                        const v1 = block1.bounce(block2);
                        const v2 = block2.bounce(block1);
                        block1.v = v1;
                        block2.v = v2;
                        currentPi = currentPi.plus(1);
                    }
                    if (block1.hitWall) {
                        block1.reverse();
                        currentPi = currentPi.plus(1);
                    }
                    block1.update();
                    block2.update();
                    res();
                }
            });
        };
        for (let j = 0; j < 10; j++) {
            await RunBlock(stepPart)
            await delay(Pi.collisionDelay);
        }
        if (block2.v.greaterThan(block1.v) && block1.v.isPositive()) {
            //There will be no more collisions -> we can end
            Pi.Collision();//Call start/end function
            return;
        }
        await Pi.CollisionsUpdate();
    },
    CollisionShow() {
        CollisionReceive.innerHTML = currentPi.toString();
        ctx.fillStyle = _Colors.Bg[0];
        ctx.fillRect(0, 0, CollisionCanvas.width, CollisionCanvas.height);
        ctx.fillStyle = _Colors.Cols[1];
        ctx.fillRect(0, 0, 10, CollisionCanvas.height);
        block1.show(ctx);
        block2.show(ctx);
        if (Pi.collisionsRunning) {
            requestAnimationFrame(Pi.CollisionShow);
        }
    },
    Random()
    {
        if (Pi.RandomId === 0)
        {
            RandomInput.innerHTML = 'Pause';
            //RandomCtx.clearRect(0, 0, RandomReceiveCanvas.width, RandomReceiveCanvas.height)
            Pi.RandomId = setInterval(Pi.RandomUpdate, 10);
        } else {
            RandomInput.innerHTML = 'Resume';
            clearInterval(Pi.RandomId);
            Pi.RandomId = 0;
        }
    },
    RandomId: 0,
    RandomCurrentPi: {
        num: new Decimal(0),
        den: new Decimal(0)
    },
    RandomUpdate()
    {
        const f = RandomGeneratorMethods[RandomSelect.value];
        const x = f(), y = f();
        RandomCtx.fillStyle = _Colors.Cols[2];
        if (x.pow(2).plus(y.pow(2)).lessThanOrEqualTo(1))
        {
            Pi.RandomCurrentPi.num = Pi.RandomCurrentPi.num.plus(1);
            RandomCtx.fillStyle = _Colors.Cols[1];
        }
        Pi.RandomCurrentPi.den = Pi.RandomCurrentPi.den.plus(1);
        RandomReceive.innerHTML = Pi.RandomCurrentPi.num.times(4).dividedBy(Pi.RandomCurrentPi.den).toSD(10).toString();
        RandomTotal.innerHTML = Pi.RandomCurrentPi.den.toString();
        //requestAnimationFrame(() => {
        RandomCtx.beginPath();
        RandomCtx.arc(x.toNumber() * 1000, y.toNumber() * 1000, 2, 0, 2 * Math.PI);
        RandomCtx.closePath();
        RandomCtx.fill();
        //})
    },
    RandomReset()
    {
        if (Pi.RandomId !== 0)
        {
            clearInterval(Pi.RandomId);
            Pi.RandomId = 0;
        }
        RandomInput.innerHTML = 'Start';
        Pi.RandomCurrentPi.num = new Decimal(0);
        Pi.RandomCurrentPi.den = new Decimal(1);
        RandomReceive.innerHTML = '0';
        RandomCtx.clearRect(0, 0, RandomReceiveCanvas.width, RandomReceiveCanvas.height);
    }
}

var SqrtDemo = {
    Input: document.getElementById('radix-example-input'),
    Rows: [],
    Generate() {
        let a = 1, b = 1, N = Number(SqrtDemo.Input.value);
        SqrtDemo.Rows.forEach(([A, B, S]) => {
            A.innerHTML = a;
            B.innerHTML = b;
            S.innerHTML = (b / a).toFixed(7);
            let nA = a + b, nB = N * a + b;
            a = nA;
            b = nB;
        });
    },
    Init() {
        let a = [...document.body.querySelectorAll('.radix-example-row-a')],
            b = [...document.body.querySelectorAll('.radix-example-row-b')],
            s = [...document.body.querySelectorAll('.radix-example-row-sqrt')];
        const order = (l, r) => 
            Number(l.getAttribute('row-index')) - Number(r.getAttribute('row-index'))
        a.sort(order); b.sort(order); s.sort(order);
        if (a.length !== b.length || a.length !== s.length) {
            throw new Error('Table columns for sqrt() demo malformed!');
        }
        for (let i = 0; i < a.length; i++) {
            SqrtDemo.Rows.push([a[i], b[i], s[i]]);
        }
        SqrtDemo.Input.addEventListener('input', SqrtDemo.Generate);
        SqrtDemo.Generate();
    }
}

Pi.Archimedes();
ArchimedesInput.addEventListener('input', Pi.Archimedes);
Pi.Archimedes2();
ArchimedesInput2.addEventListener('input', Pi.Archimedes2);

SqrtDemo.Init();

Pi.Leibniz();
LeibnizInput.addEventListener('input', Pi.Leibniz);

document.getElementById('collision-start').addEventListener('click',
    function () { Pi.Collision() });
ctx.fillStyle = _Colors.Bg[0];
ctx.fillRect(0, 0, CollisionCanvas.width, CollisionCanvas.height);
ctx.fillStyle = _Colors.Cols[1];
ctx.fillRect(0, 0, 10, CollisionCanvas.height);

Pi.Ramanujan();
RamanujanInput.addEventListener('input', Pi.Ramanujan);

RandomInput.addEventListener('click', Pi.Random);
RandomReset.addEventListener('click', Pi.RandomReset);