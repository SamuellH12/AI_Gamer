var once = -1;
var contouObs = false;
var gameOver = false;
var jurassic = []; //geração atual
var qtDinos = 15; //quantidade de dinos por geração
var dAtual = 0; //dinossauro que tá jogando agora
var gen = 0; //geração atual
var qtdGens = 20;
var escolhidosPorGen = 2;
var taxaDeMutacao = 0.0001;
var autoPass = true;
const win = this.window;


function inicializar()  //-1
{  
    for(let i=0; i<qtDinos; i++)
    {
        let MeuDino = new Dino();
        jurassic.push(MeuDino);
    }
    
    once = 0;
}    


function seleciona() //-1
{
    //ordena pela  pontuação
    jurassic.sort(  function (a,b) {
        if(a.pontos < b.pontos){ return +1; }
        else
        if(a.pontos > b.pontos){ return -1; }
        return 0;
    });

    console.log("Placar ->")
    console.table(jurassic);

    //pega os melhores da geração
    let melhores = [];
    for(let i=0; i<escolhidosPorGen; i++){
        jurassic[i].pontos = 0;
        melhores.push(jurassic[i]);
    }

    jurassic = melhores;

    console.log("Entrando no Lab");
    //criar híbridos
    for(let i=0; i<melhores.length && jurassic.length < qtDinos; i++)
    {
        for(let j=i+1; j<melhores.length && jurassic.length < qtDinos; j++)
        {
            let temp = Dino.hibrido(melhores[i], melhores[j]);
            jurassic.push(temp);
            console.table(jurassic)
        }
        if(jurassic.length < qtDinos && i == melhores.length-1){ i=-1; } //se a quantidade de hibridos ainda não tiver completa, volta ao começo
    }
    console.log("Híbridos gerados");
    console.log("Iniciando as mutações")
    //gerar mutações
    for(let i=0; i<jurassic.length; i++)
    {
        jurassic[i].mutar(taxaDeMutacao);
        
    }
    console.log("Mutantes gerados");

    once = 0; //start a new game
}

function startGame()    //0
{
    if(dAtual == qtDinos)
    { 
        gen++;
        dAtual = 0;
        once = -1; //se já testei todos os dinos em vez de restart vou para a seleção dos melhores
        return;
    }    

    console.log("Start a new game")

    //da start no jogo
    simulateKey(32); 
    simulateKey(32, 'up')
    while( win.Runner.instance_.crashed )  
    {
        simulateKey(32); 
        simulateKey(32, 'up')
    }    

    document.getElementById('InfoDinoGerenation').innerHTML = "Dinossauro Atual: " + dAtual + " Gen:" + (gen + 1);

    once = 1;   //e que comecem os jogos!!!
}    



function testaDinos()   //1
{
    if( win.Runner.instance_.crashed ) //testa se houve colisão (método do próprio jogo)
    {
        console.log("Dino", dAtual ,"perdeu (T-T)  -> ", jurassic[dAtual].pontos, " pontos")
        once = 0;
        dAtual++;
        return;
    }    

    //pega os inputs
    let dino = win.Runner.instance_.tRex;
    var altDino = dino.yPos;
    var distObst = 10000;
    var altObst = 0;
    var largObst = 0;
    var compObst = 0;
    var vel = win.Runner.instance_.currentSpeed;

    if(win.Runner.instance_.horizon.obstacles.length > 0)
    {
        let obs  = win.Runner.instance_.horizon.obstacles[0];
        compObst = obs.typeConfig.width;
        largObst = obs.typeConfig.height;
        altObst  = obs.yPos;
        distObst = obs.xPos - dino.xPos;
    }    

    //conta a pontuação de cada dino (quantos obstáculos cada um passou)
    if(distObst < 0 && contouObs == false){
        jurassic[dAtual].pontos++;
        contouObs = true;
    } else {
        contouObs = false;
    }    

    //roda a rede neural do dinossauro atual
    let comando = jurassic[dAtual].brain.predict( [altDino, distObst, altObst, largObst, compObst, vel] );

    //envia os comandos para o jogo
    if(comando > 0.55)
    {
        simulateKey(38);
        simulateKey(40, "up");
    }    
    else
    if(comando < 0.45)
    {
        simulateKey(40);
    }    
    else
    {
        simulateKey(40, "up");
    }    
        
}    



function main(){
    setTimeout( function(){

        if(gen == qtdGens)
        {
            document.getElementById("restartGen").style.display = "block";
            return;
        }

        if( once ==-1 ) //pre game -> inicializar valores ou gerar nova geração
        {
            if(gen == 0){ inicializar(); }
            else
            {
                if(autoPass){ seleciona(); }
                else{ document.getElementById("continue").style.display = "block";}
            }
        }
        else
        if( once == 0){ startGame(); } //0
        else
        if( once == 1){ testaDinos(); } //1
        
        main();
    } ,50);
}









//UI de usuário

setTimeout( function()
{
    document.getElementById('InfosAI').innerHTML += `
    <div>
        
      <div>Dinos Per Gen: <input id="dinPGen" type='number' value=15> </div>
      <div>Number of Gens: <input id="nGen" type='number' value=20> </div>
      <div>Selected per Gen: <input id="selec" type='number' value=2> </div>
      <div>Mutation Factor: <input id="taxa" type='number' max="1" value=0.0001> </div>
      <div>Automatically Pass Gen - Yes:<input id="autoPassYes" name="autoPass" type="radio" checked value="true"> /  No:<input id="autoPassNo" name="autoPass" type="radio" value="false"></div>
      <button onclick="salvarInput()" >Save Options</button>

      <p id="textolog"> ... </p>

      <button id="start"                            onclick="start()">      Start                </button>
      <button id="restartGen" style="display: none" onclick="restartGen()"> Restart the last Gen </button>
      <button id="continue"   style="display: none" onClick="continua()">   Continue             </button>
      <button                 style="display: none">                        Upload a Dino        </button>
      <button                 style="display: none" >                       download a Dino      </button>
        
    </div>
  
    <h3 id="InfoDinoGerenation"></h3>
    ` ;
}, 30)

function start()
{
    document.getElementById("start").style.display = "none";
    main();
}

function restartGen()
{
    gen--;
    dAtual = 0;
    once = 0;
    document.getElementById("restartGen").style.display = "none";
    main();
}

function continua()
{
    document.getElementById("continue").style.display = "none";
    seleciona();
}

function salvarInput(){

    qtDinos = parseInt( document.getElementById("dinPGen").value, 10 );
    qtdGens = parseInt( document.getElementById("nGen").value, 10 );
    escolhidosPorGen =  parseInt( document.getElementById("selec").value, 10 );
    taxaDeMutacao = parseFloat( document.getElementById("taxa").value )
    autoPass = document.getElementById("autoPassYes").checked;
    console.log(autoPass)
    document.getElementById("textolog").innerHTML = "Options Saved!";
}

function download(n)
{
    console.log("Em breve");
    // saveAs(new Blob( [ JSON.stringify(jurassic[0]) ], { type: "text/plain;charset=utf-8" }), "static.txt")
}

function uoload(n)
{
    console.log("Em breve");
}

//main();


//access the values of the brain of dinos: jurassic[0].brain.weigth_ho.data[0][0]
/*
testar se ouve colisão
if( win.Runner.instance_.horizon.obstacles.length > 0 &&
    win.checkForCollision(win.Runner.instance_.horizon.obstacles[0], win.Runner.instance_.tRex) ) //testa se houve colisão (método do próprio jogo)
    
//win.Runner.instance_.tRex.startJump(win.Runner.instance_.currentSpeed); pular


<div>
    <button onclick="main()"> Start </button>
    <button> Load a Dino </button>
    <p id="textolog"> ... </p>
  </div>
  
  <h3 id="InfoDinoGerenation"> ... </h3>


    function testes(){
        setTimeout( function(){
    
                MeuDino = new Dino();
                let temp = JSON.stringify(MeuDino)
                var blob = new Blob( [ JSON.stringify(MeuDino) ], { type: "text/plain;charset=utf-8" });
                console.log(MeuDino.brain)
                //saveAs(blob, "static.txt")

                JSON.stringify(jurassic[0])

                saveAs(new Blob( [ JSON.stringify(jurassic[0]) ], { type: "text/plain;charset=utf-8" }), "static.txt")
*/