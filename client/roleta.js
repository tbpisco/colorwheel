var Roleta = function(config){

    var self = {};

	self.canvas = config.canvas || "";
	self.context="";
	self.scaleNum=1;
    self.inicia = false;
    self.intervalFeedback= null;
    self.interval = null;
    self.quantidade = config.quantidade || 12;
    self.cores = ["#ff7d00","#ff3700","#f52394", "#8c20ba", "#1e3db9","#00619d","#00b3d5","#00b800","#83ce00","#ffe100","#ffcf00","#ffa600"];
    self.width=500;
    self.height=500;
    self.centerX = self.width/2;
    self.centerY = self.height/2;
    self.count=0;
    self.cenario=0;
    self.countPino=0;
    self.anteriorCountPino =0;
    self.velocidade=0;
    self.aceleracao=-0.05;
    self.rangeHipo = 10;

	self.config = function(){


        self.scaleNum = 1;
        self.canvas.style.maxWidth = "100%";
        self.canvas.style.maxHeight = "100%";
        self.canvas.width = self.width;
        self.canvas.height = self.height;
    	self.context = self.canvas.getContext("2d");

        self.desenhar();
        
	},

    self.restart = function()
    {
        self.interval = setInterval(self.desenhar,1000/12);
    },
	
    self.sortearRoleta = function()
    {
        if(!self.inicia){
            self.cenario = Math.floor(Math.random()*self.quantidade+1);
            self.velocidade = (360/self.quantidade)*self.cenario;
            self.inicia = true;
            self.interval = setInterval(self.desenhar,1000/12);
        }
    };

    self.desenhar = function()
    {
        self.context.clearRect(0,0,self.width, self.height);
        self.velocidade = self.velocidade + self.velocidade*self.aceleracao
        if(Math.floor(self.velocidade)<=0 && self.inicia){
            setTimeout(function(){clearInterval(self.interval);self.inicia = false;},3000);
        }
        self.count+=self.velocidade; 
        self.count = self.count%360;
        self.desenharRoleta();
    };

    self.desenharRoleta = function()
    {

        var qtd = self.quantidade;
        var hipoInicial = self.width*0.45;
        var centerX = self.width/2;
        var centerY = self.height/2;
        self.context.globalAlpha =1 ;

        self.context.save();
        self.context.translate(centerX,centerY);
        self.context.rotate((self.count-0.1)*Math.PI/180);
        self.context.translate(-centerX,-centerY);

        for (var i = 0; i < qtd; i++) {
            self.context.fillStyle = self.cores[i];
            self.context.lineWidth = 1;
            self.context.strokeStyle = self.cores[i];
            self.context.beginPath();
            self.context.moveTo(self.centerX, self.centerY);

            self.context.lineTo(Math.cos((2*Math.PI * (qtd + i+0.5)) / qtd) * hipoInicial + self.centerX, Math.sin((2*Math.PI * (qtd + i+0.5)) / qtd) * hipoInicial + self.centerY);
            self.context.lineTo(Math.cos((2*Math.PI * (qtd + i + 1+0.5)) / qtd) * hipoInicial + self.centerX, Math.sin((2*Math.PI * (qtd + i + 1+0.5)) / qtd) * hipoInicial + self.centerY);

            self.context.closePath();
            self.context.fill();
            self.context.stroke();

            self.context.beginPath();
            self.context.arc(self.canvas.width / 2, self.canvas.height / 2, hipoInicial, 2*Math.PI/qtd * (i +0.5), 2*Math.PI/qtd * (i+1+0.5), false);
            self.context.lineWidth = self.line;
            self.context.fillStyle = self.cores[i];
            self.context.strokeStyle = self.cores[i];
            self.context.fill();
            self.context.stroke();
        }

        self.context.restore();

        self.context.save();
        self.context.translate(centerX,centerY);
        self.context.rotate(self.count*Math.PI/180);
        self.context.translate(-centerX,-centerY);

        var distanciaCirculos = hipoInicial -10;
        var quantidadeCirculos = qtd;
        for (var i = 0; i < quantidadeCirculos; i++) {
            
          
            self.context.beginPath();
            self.context.arc(Math.cos((2*Math.PI*(quantidadeCirculos+i+0.5))/quantidadeCirculos)*distanciaCirculos +centerX, Math.sin((2*Math.PI*(quantidadeCirculos+i+0.5))/quantidadeCirculos)*distanciaCirculos +centerY, self.canvas.width / 120 , 0, 2*Math.PI, false);
            self.context.fillStyle = "rgba(0,0,0,0.2)";
            self.context.fill();

            self.context.beginPath();
            self.context.arc(Math.cos((2*Math.PI*(quantidadeCirculos+i+0.5))/quantidadeCirculos)*(distanciaCirculos-2) +centerX, Math.sin((2*Math.PI*(quantidadeCirculos+i+0.5))/quantidadeCirculos)*(distanciaCirculos-2) +centerY, self.canvas.width / 120 , 0, 2*Math.PI, false);
            self.context.fillStyle = "rgba(255,255,255,1)";
            self.context.fill();
        };
        
        self.context.restore();

         /*circulo central*/
        for (var i = 0; i < qtd; i++) {
            self.context.fillStyle = "rgba(255,255,255,0.5)";
            self.context.beginPath();
            self.context.moveTo(self.centerX, self.centerY);
            self.context.lineTo(Math.cos((2*Math.PI * (qtd + i)) / qtd) * self.canvas.width / 10 + self.centerX, Math.sin((2*Math.PI * (qtd + i)) / qtd) * self.canvas.width / 10 + self.centerY);
            self.context.lineTo(Math.cos((2*Math.PI * (qtd + i + 1)) / qtd) * self.canvas.width / 10 + self.centerX, Math.sin((2*Math.PI * (qtd + i + 1)) / qtd) * self.canvas.width / 10 + self.centerY);
            self.context.closePath();
            self.context.fill();
        }

        self.context.beginPath();
        self.context.arc(self.canvas.width / 2, self.canvas.height / 2, self.canvas.width / 40 , 0, 2*Math.PI, false);
        self.context.fillStyle = "rgba(255,255,255,0.8)";
        self.context.fill();

        /*ROTATE PINO*/
        self.anteriorCountPino = self.countPino;
        var num = 360/qtd/6;

        for (var i = 0; i < qtd; i++) {
            if(Math.ceil(self.count)>=((360/qtd*i)+num*2) && Math.ceil(self.count) < ((360/qtd*i)+num*3))
            {
                self.countPino=340;
            }
            else if(Math.ceil(self.count)>=((360/qtd*i)+num*3) && Math.ceil(self.count) < ((360/qtd*i)+num*4))
            {
                self.countPino=20; 
            }
            else if(Math.ceil(self.count)>=((360/qtd*i)-num*2) && Math.ceil(self.count) < ((360/qtd*i)+num*2) || Math.ceil(self.count)>=((360/qtd*i)+num*4) && Math.ceil(self.count) < ((360/qtd*i)+360/qtd))
            {
                self.countPino=0;
            }
        };


        self.context.save();
        self.context.translate((centerX*2 -10),(centerY));
        self.context.rotate(self.countPino*Math.PI/180);
        self.context.translate(-(centerX*2-10),-(centerY));

        self.context.fillStyle = "rgba(255,255,255,1)";

        self.context.beginPath();
        self.context.beginPath();
        self.context.moveTo(500,250);
        self.context.bezierCurveTo(500,257,493,264,485,264);
        self.context.bezierCurveTo(481,264,477,263,474,261);
        self.context.bezierCurveTo(470,260,455,252,455,250);
        self.context.bezierCurveTo(455,247,467,240,474,238);
        self.context.bezierCurveTo(477,236,481,235,485,235);
        self.context.bezierCurveTo(493,235,500,242,500,250);
        self.context.fill();


        self.context.beginPath();
        self.context.arc(self.canvas.width-14, centerY+2, self.canvas.width / 80 , 0, 2*Math.PI, false);
        self.context.fillStyle = "rgba(0,0,0,0.5)";
        self.context.fill();

        self.context.beginPath();
        self.context.arc(self.canvas.width-15, centerY+0, self.canvas.width / 80 , 0, 2*Math.PI, false);
        self.context.fillStyle = "rgba(255,0,0,0.9)";
        self.context.fill();

        self.context.restore();        
    },

	self.init = function(){
		self.config();
	}

    return self;
}