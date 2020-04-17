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

    draw(ctx) {
    }

    drawBackground(ctx) {
    }

    isInsideBound(particle) {
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

    draw(ctx) {
        ctx.clearRect(this.x, this.y, this.x + this.width, this.y + this.height);
        this.drawBackground(ctx);
        for (let i = 0; i < this.count; i++) {
            this.particles[i].draw(ctx);
        }
    }

    drawBackground(ctx) {
        if (this.backgroundColor) {
            ctx.beginPath();
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(this.x, this.y, this.x + this.width, this.y + this.height);
        }
    }

    isInsideBound(particle) {
        let x = particle.x;
        let y = particle.y;
        let particleRadius = particle.radius;
        if (x - particleRadius < this.x || x + particleRadius > this.x + this.width || y - particleRadius < this.y || y > this.y + this.height) {
            if (particle.motion === "shake") {
                if (x - particleRadius < this.x) {
                    x = this.x + particleRadius;
                } else if (x + particleRadius > this.x + this.width) {
                    x = this.x + this.width - particleRadius;
                }
                if (y - particleRadius < this.y) {
                    y = this.y + particleRadius;
                } else if (y + particleRadius > this.y + this.height) {
                    y = this.y + this.height - particleRadius;
                }
                return {x, y};
            } else if (particle.motion === "sport") {
                let vectorI = {x: Math.cos(particle.vector), y: Math.sin(particle.vector)};
                let vectorN = {};
                if (x - particleRadius < this.x) {
                    vectorN.x = -1;
                    vectorN.y = 0;
                } else if (x + particleRadius > this.x + this.width) {
                    vectorN.x = 1;
                    vectorN.y = 0;
                } else if (y - particleRadius < this.y) {
                    vectorN.x = 0;
                    vectorN.y = -1;
                } else if (y > this.y + this.height) {
                    vectorN.x = 0;
                    vectorN.y = 1;
                }
                let theta = Math.acos((vectorN.x * vectorI.x + vectorN.y * vectorI.y) / (Math.sqrt(Math.pow(vectorN.x, 2) + Math.pow(vectorN.y, 2)) + Math.sqrt(Math.pow(vectorI.x, 2) + Math.pow(vectorI.y, 2))));
                if (theta > Math.PI / 3) {
                    theta = window.random(0, theta);
                }
                return 2 * Math.PI - (Math.PI - particle.vector - 2 * theta);
            }

        }
        return null;
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
        this.originCx = option.cx;
        this.originCy = option.cy;
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

    draw(ctx) {
        ctx.clearRect(this.cx - this.radius, this.cy - this.radius, this.cx + this.radius, this.cy + this.radius);
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

    isInsideBound(particle) {
        let x = particle.x;
        let y = particle.y;
        let particleRadius = particle.radius;
        if (Math.sqrt(Math.pow(this.cx - x, 2) + Math.pow(this.cy - y, 2)) > (this.radius - particleRadius)) {
            if (particle.motion === "shake") {
                let radian = Math.acos((particle.x - this.cx) / Math.sqrt(Math.pow(particle.x - this.cx, 2) + Math.pow(particle.y - this.cy, 2)));
                if (particle.x < this.cx && particle.y > this.cy) {
                    radian = 2 * Math.PI - radian;
                } else if (particle.x > this.cx && particle.y >= this.cy) {
                    radian = 2 * Math.PI - radian;
                }
                const x = this.cx + Math.cos(radian) * (this.radius - particleRadius);
                const y = this.cy - Math.sin(radian) * (this.radius - particleRadius);
                return {x, y};
            } else if (particle.motion === "sport") {
                let vectorI = {x: Math.cos(particle.vector), y: Math.sin(particle.vector)};
                let vectorN = {x: x - this.cx, y: y - this.cy};
                let theta = Math.acos((vectorN.x * vectorI.x + vectorN.y * vectorI.y) / (Math.sqrt(Math.pow(vectorN.x, 2) + Math.pow(vectorN.y, 2)) + Math.sqrt(Math.pow(vectorI.x, 2) + Math.pow(vectorI.y, 2))));
                if (theta > Math.PI / 3) {
                    theta = window.random(0, theta);
                }
                return 2 * Math.PI - (Math.PI - particle.vector - 2 * theta);
            }

        }
        return null;
    }

    scaleVessel(scale) {
        this.radius = this.originadius * scale; //缩放半径
        this.cx = this.originCx * scale;
        this.cy = this.originCy * scale;
        const scaleParticle = scale / this.scale;
        this.scale = scale;
        for (let i = 0; i < this.count; i++) {
            this.particles[i].x = this.particles[i].x * scaleParticle;
            this.particles[i].y = this.particles[i].y * scaleParticle;
            this.particles[i].speed = this.particles[i].speed / scaleParticle;
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
        if (option.motion === "sport") {
            //初始运动方向
            this.vector = window.random(0, 2 * Math.PI);
        }
        this.color = {}
        if(option.radiaGradient){
            this.color.start = option.radiaGradient.start;
            this.color.stop = option.radiaGradient.stop;
        }else{
            this.color.start = option.color || "red";
            this.color.stop = option.color || "red";
        }
    }

    draw(ctx) {
        if (this.motion === "shake") {
            this.shake();
        } else if (this.motion === "sport") {
            this.sport();
        }
        ctx.beginPath();
        let gradient = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.radius);
        gradient.addColorStop(0,this.color.start);
        gradient.addColorStop(1,this.color.stop);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    shake() {
        let speedX = random(-this.speed, this.speed);
        let speedY = random(-this.speed, this.speed);
        this.x += speedX;
        this.y += speedY;
        let coord = this.vessel.isInsideBound(this);
        if (coord != null) {
            this.x = coord.x;
            this.y = coord.y;
        }
    }

    sport() {
        let speedX = this.speed * Math.cos(this.vector);
        let speedY = this.speed * Math.sin(this.vector);
        this.x += speedX;
        this.y += speedY;
        let theta = this.vessel.isInsideBound(this);
        if (theta != null) {
            this.vector = theta;
        }
    }
}

class Jitter {
    constructor(option) {
        this.canvas = null;
        this.ctx = null;
        const canvasId = option.canvasId;
        let canvas = document.getElementById(canvasId);
        this.canvas = canvas;
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
        this.vessel.draw(this.ctx);
        this.handler = requestAnimationFrame(this.display.bind(this));
    }

    jitterScale(scale) {
        this.vessel.scaleVessel(scale);
    }

    destroy(){
       cancelAnimationFrame(this.handler);
    }
}