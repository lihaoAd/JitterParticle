window.random = function (min, max) {
    return (Math.random() * (max - min)) + min;
};

class Vessel {
    constructor(option) {
        this.count = 1;
        this.particles = [];
        this.count = option.count || 1;
        this.backgroundColor = option.backgroundColor;
    }

    generate(option) {
        for (let i = 0; i < this.count; i++) {
            this.particles.push(new Particle(this, option));
        }
    }

    draw(canvas,ctx) {
    }

    drawBackground(ctx) {
    }

    insideBound(particle) {
    }

    scaleVessel(scale) {
    }

    allocateParticleLocation(particleRadius) {
    }
}

class EllipseVessel extends Vessel {
    constructor(option) {
        super(option);
    }

    draw(ctx) {
    }
}

class RectVessel extends Vessel {

    constructor(option) {
        super(option);
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.width = option.width || 100;
        this.height = option.height || 100;
        this.originX = this.x;
        this.originY = this.y;
        this.originWidth = this.width;
        this.originHeight = this.height;
        this.scale = 1;
        this.generate(option);
    }

    allocateParticleLocation(particleRadius) {
        let location = {};
        location.x = window.random(this.x + particleRadius, this.x + this.width - particleRadius);
        location.y = window.random(this.y + particleRadius, this.y + this.height - particleRadius);
        return location;
    }

    draw(canvas,ctx) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        this.drawBackground(ctx);
        for (let i = 0; i < this.count; i++) {
            this.particles[i].draw(ctx);
        }
    }

    drawBackground(ctx) {
        if (this.backgroundColor) {
            ctx.beginPath();
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(this.x, this.y,  this.width,  this.height);
        }
    }

    insideBound(particle) {
        let particleRadius = particle.radius;
        if ( particle.x - particleRadius <= this.x ||  particle.x + particleRadius >= this.x + this.width
            ||  particle.y - particleRadius <= this.y ||  particle.y+particleRadius >= this.y + this.height) {
            if (particle.motion === "shake") {
                if ( particle.x - particleRadius <= this.x) {
                    particle.x = this.x + particleRadius;
                } else if (particle.x + particleRadius >= this.x + this.width) {
                    particle.x = this.x + this.width - particleRadius;
                }
                if ( particle.y - particleRadius <= this.y) {
                    particle.y = this.y + particleRadius;
                } else if ( particle.y + particleRadius > this.y + this.height) {
                    particle.y = this.y + this.height - particleRadius;
                }
            } else if (particle.motion === "sport") {
                let vectorI = {x: Math.cos(particle.vector), y: Math.sin(particle.vector)};
                let vectorN = {};
                if ( particle.x - particleRadius <= this.x) {
                    particle.x = this.x + particleRadius;
                    vectorN.x = -1;
                    vectorN.y = 0;
                }else if (particle.x + particleRadius >= this.x + this.width) {
                    particle.x = this.x + this.width - particleRadius;
                    vectorN.x = 1;
                    vectorN.y = 0;
                }

                if ( particle.y - particleRadius <= this.y) {
                    particle.y = this.y + particleRadius;
                    vectorN.x = 0;
                    vectorN.y = -1;
                }else if ( particle.y + particleRadius > this.y + this.height) {
                    particle.y = this.y + this.height - particleRadius;
                    vectorN.x = 0;
                    vectorN.y = 1;
                }
                const iDotN = vectorI.x * vectorN.x + vectorI.y * vectorN.y;
                const q = 2 * iDotN / (Math.pow(vectorN.x, 2) + Math.pow(vectorN.y, 2));
                const vectorM = {x: -(q * vectorN.x - vectorI.x), y: -(q * vectorN.y - vectorI.y)};
                let theta = Math.acos(vectorM.x / Math.sqrt(Math.pow(vectorM.x, 2) + Math.pow(vectorM.y, 2)));
                if (vectorM.y < 0) {
                    theta = 2 * Math.PI - theta;
                }
                particle.vector = theta;
            }

        }
    }

    scaleVessel(scale) {
        this.x = this.originX * scale;
        this.y = this.originY * scale;
        this.width = this.originWidth * scale;
        this.height = this.originHeight * scale;
        const scaleParticle = scale / this.scale;
        this.scale = scale;
        for (let i = 0; i < this.count; i++) {
            this.particles[i].x = this.particles[i].x * scaleParticle;
            this.particles[i].y = this.particles[i].y * scaleParticle;
            this.particles[i].speed = this.particles[i].speed / scaleParticle;
        }
    }
}

class CircleVessel extends Vessel {

    constructor(option) {
        super(option);
        this.radius = option.radius;
        this.originadius = option.radius;
        this.cx = option.cx;
        this.cy = option.cy;
        this.scale = 1;
        this.generate(option);
    }

    allocateParticleLocation(particleRadius) {
        let pole = window.random(0, this.radius - particleRadius);
        let radian = window.random(0, 2 * Math.PI); //象限弧度
        let x = this.cx + Math.cos(radian) * pole;
        let y = this.cy + Math.sin(radian) * pole;
        let location = {};
        location.x = x;
        location.y = y;
        return location;
    }

    draw(canvas,ctx) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        this.drawBackground(ctx);
        for (let i = 0; i < this.count; i++) {
            this.particles[i].draw(ctx);

        }
    }

    drawBackground(ctx) {
        if (this.backgroundColor) {
            ctx.beginPath();
            ctx.fillStyle = this.backgroundColor;
            ctx.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI, true);
            ctx.fill();
        }
    }

    insideBound(particle) {
        let particleRadius = particle.radius;
        if (Math.sqrt(Math.pow(this.cx - particle.x, 2) + Math.pow(this.cy - particle.y, 2)) > (this.radius - particleRadius)) {
            if (particle.motion === "shake") {
                let radian = Math.acos((particle.x - this.cx) / Math.sqrt(Math.pow(particle.x - this.cx, 2) + Math.pow(particle.y - this.cy, 2)));
                if (particle.x < this.cx && particle.y > this.cy) {
                    radian = 2 * Math.PI - radian;
                } else if (particle.x > this.cx && particle.y >= this.cy) {
                    radian = 2 * Math.PI - radian;
                }
                const xTemp = this.cx + Math.cos(radian) * (this.radius - particleRadius);
                const yTemp = this.cy - Math.sin(radian) * (this.radius - particleRadius);
                particle.x = xTemp;
                particle.y = yTemp;
            } else if (particle.motion === "sport") {
                let f = Math.acos((particle.x - this.cx) / Math.sqrt(Math.pow(particle.x - this.cx, 2)
                    + Math.pow(particle.y - this.cy, 2)));
                if (particle.y > this.cy) {
                    f = Math.PI * 2 - f;
                }
                //限制超出范围，计算临界坐标
                particle.x = this.cx + (this.radius - particleRadius) * Math.cos(f);
                particle.y = this.cy - (this.radius - particleRadius) * Math.sin(f);
                //粒子的方向向量
                const vectorI = {x: Math.cos(particle.vector), y: Math.sin(particle.vector)};
                //对称轴向量
                const vectorN = {x: particle.x - this.cx, y: -particle.y + this.cy};
                const iDotN = vectorI.x * vectorN.x + vectorI.y * vectorN.y;
                const q = 2 * iDotN / (Math.pow(vectorN.x, 2) + Math.pow(vectorN.y, 2));
                const vectorM = {x: -(q * vectorN.x - vectorI.x), y: -(q * vectorN.y - vectorI.y)};
                let theta = Math.acos(vectorM.x / Math.sqrt(Math.pow(vectorM.x, 2) + Math.pow(vectorM.y, 2)));
                if (vectorM.y < 0) {
                    theta = 2 * Math.PI - theta;
                }
                particle.vector = theta;
            }
        }
    }

    scaleVessel(scale) {
        let realScale = scale;
        this.radius = this.originadius * realScale; //缩放半径
        const scaleParticle = realScale / this.scale;
        this.scale = realScale;
        for (let i = 0; i < this.count; i++) {
            const particle = this.particles[i];
            const radial = Math.sqrt(Math.pow(particle.x - this.cx, 2) + Math.pow(particle.y - this.cy, 2)) * scaleParticle;
            let theta = Math.acos((particle.x - this.cx) /
                Math.sqrt(Math.pow(particle.x - this.cx, 2) + Math.pow(particle.y - this.cy, 2)));
            if (particle.y < this.cy) {
                particle.x = this.cx + radial * Math.cos(theta);
                particle.y = this.cy - radial * Math.sin(theta);
            } else {
                theta = Math.PI * 2 - theta;
                particle.x = this.cx + radial * Math.cos(theta);
                particle.y = this.cy - radial * Math.sin(theta);
            }
            particle.speed /= scaleParticle;
        }
    }
}

class Particle {
    constructor(vessel, option) {
        this.vessel = vessel;
        let motion = option.motion || "shake";
        let radius = window.random(option.particleMinRadius, option.particleMaxRadius); //粒子半径
        this.speed = option.speed || 1;
        const location = this.vessel.allocateParticleLocation(radius);
        this.x = location.x;
        this.y = location.y;
        this.motion = motion;
        this.radius = radius;
        this.radiaGradientColorStart = null;
        this.radiaGradientColorStop = null;
        if (option.motion === "sport") {
            //初始运动方向
            this.vector = window.random(0, 2 * Math.PI);
        }

        if (option.radiaGradient) {
            this.radiaGradientColorStart = option.radiaGradient.start;
            this.radiaGradientColorStop = option.radiaGradient.stop;
        } else{
            this.color = option.color || 'red';
        }
    }

    draw(ctx) {
        if (this.motion === "shake") {
            this.shake();
        } else if (this.motion === "sport") {
            this.sport();
        }

        if (this.color) {
            ctx.fillStyle = this.color;
        } else if (this.radiaGradientColorStart && this.radiaGradientColorStop) {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, this.radiaGradientColorStart);
            gradient.addColorStop(1, this.radiaGradientColorStop);
            ctx.fillStyle = gradient;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    shake() {
        let speedX = window.random(-this.speed, this.speed);
        let speedY = window.random(-this.speed, this.speed);
        this.x += speedX;
        this.y += speedY;
        this.vessel.insideBound(this);
    }

    sport() {
        let speedX = this.speed * Math.cos(this.vector);
        let speedY = this.speed * Math.sin(this.vector);
        this.x += speedX;
        this.y -= speedY;
        this.vessel.insideBound(this);
    }
}

class Jitter {
    constructor(option) {
        const canvasId = option.canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        const vessel = option.vessel || "circle";
        if ("circle" === vessel) {
            this.vessel = new CircleVessel(option);
        } else if ("rect" === vessel) {
            this.vessel = new RectVessel(option);
        } else if ("ellipse" === vessel) {
            this.vessel = new EllipseVessel(option);
        } else {
            throw "do not support " + vessel;
        }
        this.handler = requestAnimationFrame(this.display.bind(this));
    }

    display() {
        this.vessel.draw(this.canvas,this.ctx);
        this.handler = requestAnimationFrame(this.display.bind(this));
    }

    jitterScale(scale) {
        this.vessel.scaleVessel(scale);
    }

    destroy(){
       cancelAnimationFrame(this.handler);
    }
}