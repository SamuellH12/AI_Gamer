var once = -1;
var contouObs = false;
var gameOver = false;
var jurassic = []; //geração atual
var qtDinos = 15; //quantidade de dinos por geração
var qtDinosNextGen = qtDinos; //para ser possível alterar o valor da próxima geração sem impactar a atual
var dAtual = 0; //dinossauro que tá jogando agora
var gen = 0; //geração atual
var qtdGens = 20;
var escolhidosPorGen = 2;
var taxaDeMutacao = 0.2;
var autoPass = true;
const win = this.window;
var cnt = 0;
var graf = false;

function inicializar()  //-1
{  
    for(let i=0; i<qtDinos; i++)
    {
        let MeuDino = new Dino();
        jurassic.push(MeuDino);
    }
    
    once = 0;
}    

function signoid(x){
    return 1/(1 + Math.exp(-x));
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
        }
        if(jurassic.length < qtDinos && i == melhores.length-1){ i=-1; } //se a quantidade de hibridos ainda não tiver completa, volta ao começo
    }
    console.log("Híbridos gerados");
    //gerar mutações
    for(let i=0; i<jurassic.length; i++)
    {
        jurassic[i].mutar(taxaDeMutacao);
        
    }
    console.log("Mutantes gerados");
    document.getElementById("textolog").innerHTML = "New Generation Ready!";

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
        console.log("Dino", dAtual ,"perdeu (T-T)  -> ", jurassic[dAtual].pontos, " pontos");
        document.getElementById("textolog").innerHTML = "GAME OVER";
        once = 0;
        dAtual++;
        return;
    }    

    //pega os inputs
    let dino = win.Runner.instance_.tRex;
    let altDino = dino.yPos;
    let distObst = 10000;
    let altObst = 0;
    let largObst = 0;
    let compObst = 0;
    let vel = win.Runner.instance_.currentSpeed;

    if(win.Runner.instance_.horizon.obstacles.length > 0)
    {
        let obs  = win.Runner.instance_.horizon.obstacles[0];
        compObst = obs.typeConfig.width;
        largObst = obs.typeConfig.height;
        altObst  = obs.yPos;
        distObst = obs.xPos - dino.xPos;
    }    

    //conta a pontuação de cada dino (quantos obstáculos cada um passou)
    //as vezes conta cactos grandes como 2 (/*°-°)\
    if(distObst < 0 && contouObs == false){
        jurassic[dAtual].pontos++;
        contouObs = true;
        document.getElementById("textolog").innerHTML = "Score: " + jurassic[dAtual].pontos;
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

    if(graf == true)
    {
        Plotly.extendTraces('chart',{ y:[[ signoid(comando) ]]}, [0]);
        cnt++;
        if(cnt > 60) {
            Plotly.relayout('chart',{ xaxis: {range: [cnt-50,cnt+10]}  } );
        }
    }
}    



function main(){
    setTimeout( function(){

        if(gen == qtdGens)
        {
            document.getElementById("restartGen").style.display = "block";
            console.log(jurassic);
            return;
        }

        if( once ==-1 ) //pre game -> inicializar valores ou gerar nova geração
        {

            qtDinos = qtDinosNextGen;
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






/***************************
*   User Interface - UI
***************************/

setTimeout( function()
{
    document.getElementById('InfosAI').innerHTML = `
    <div style="display: flex;" >
    <div style="display: block; width: 40vw;">
        <h1 style="margin: 0;"> Dino AI </h1>
        <h3 style="margin-top: 0;"> by <a href="https://github.com/SamuellH12"> SamuellH12 </a> </h3>
        
      <div>Dinos Per Gen:       <input id="dinPGen" type='number' value=15> </div>
      <div>Number of Gens:      <input id="nGen"    type='number' value=20> </div>
      <div>Selected per Gen:    <input id="selec"   type='number' value=2> </div>
      <div>Mutation Factor:     <input id="taxa"    type='number' max="1" value=0.2> </div>
      <div>Automatically Pass Gen - Yes:<input id="autoPassYes" name="autoPass" type="radio" checked value="true"> /  No:<input id="autoPassNo" name="autoPass" type="radio" value="false"></div>
      <button onclick="salvarInput()" >Save Options</button>

      <p id="textolog"> ... </p>

      <button id="start"                            onclick="start()">       Start               </button>
      <button id="graphButton"style="display: none" onclick="showGraph()">   Graphic             </button>
      <button id="restartGen" style="display: none" onclick="restartGen()">  Restart the last Gen</button>
      <button id="continue"   style="display: none" onClick="continua()">    Continue            </button>
      <button id="downButton" style="display: none" onClick="showDownUp(1)"> Upload a Dino       </button>
      <button id="upButton"   style="display: none" onClick="showDownUp(2)"> Download a Dino     </button>
      <input  id="dinoDown"   style="display: none" type='number' >
      <input  id="dinoUp"     style="display: none" type='text'   hint="dino.JSON">
      <button id="confirmDown"style="display: none" onClick="download()">           Confirm      </button>
      <button id="confirmUp"  style="display: none" onClick="upload()">             Confirm      </button>
        
      <h3 id="InfoDinoGerenation"></h3>

    </div>

    <div id="chart" style="width: 60vw; height:50vh"></div>

    </div>
    ` ;
}, 30)

function start()
{
    document.getElementById("start").style.display = "none";
    document.getElementById("downButton").style.display = "block";
    document.getElementById("upButton").style.display = "block";
    document.getElementById("graphButton").style.display = "block";
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

    qtDinosNextGen = parseInt( document.getElementById("dinPGen").value, 10 );
    qtdGens = parseInt( document.getElementById("nGen").value, 10 );
    escolhidosPorGen =  parseInt( document.getElementById("selec").value, 10 );
    taxaDeMutacao = parseFloat( document.getElementById("taxa").value )
    autoPass = document.getElementById("autoPassYes").checked;
    document.getElementById("textolog").innerHTML = "Options Saved!";
}

function download(n)
{
    let numDino = parseInt( document.getElementById("dinoDown").value, 10 );

    if(numDino < qtDinos){
        saveAs(new Blob( [ JSON.stringify(jurassic[numDino]) ], 
        { type: "text/plain;charset=utf-8" }), 
        "Dino"+numDino+"_Gen"+(gen+1)+"_Score"+jurassic[numDino].pontos+".txt");
        document.getElementById("textolog").innerHTML = "Successfully Downloaded!";
    }
    else
    {
        document.getElementById("textolog").innerHTML = "Error! Number must be between 0 and "+(qtDinos-1);
    }

    document.getElementById("downButton").style.display = "block";
    document.getElementById("upButton").style.display = "block";
    document.getElementById("dinoDown").style.display = "none";
    document.getElementById("confirmDown").style.display = "none";
}

function upload(n)
{
    let newDinoJ = JSON.parse( document.getElementById("dinoUp").value );
    let newDino = new Dino(); 
    
    newDino = Dino.hibrido(newDinoJ, newDinoJ); //gambiarra ( *^-^)

    console.log(newDino);
    jurassic.push(newDino);
    qtDinos++;
    document.getElementById("textolog").innerHTML = "Dino add at end of the generation";
    document.getElementById("downButton").style.display = "block";
    document.getElementById("upButton").style.display = "block";
    document.getElementById("dinoUp").style.display = "none";
    document.getElementById("confirmUp").style.display = "none";
}

function showDownUp(x)
{
    document.getElementById("downButton").style.display = "none";
    document.getElementById("upButton").style.display = "none";

    if(x == 1)
    {
        document.getElementById("dinoUp").style.display = "block";
        document.getElementById("confirmUp").style.display = "block";
        document.getElementById("textolog").innerHTML = "Enter the dino json:";
    }
    else
    {
        document.getElementById("dinoDown").style.display = "block";
        document.getElementById("confirmDown").style.display = "block";
        document.getElementById("textolog").innerHTML = "Enter the dino number:";
    }
}

function showGraph()
{
    if(graf == false)
    {
        if(cnt == 0){
            Plotly.newPlot('chart',[{y:[0], type:'line'}]);
        }

        document.getElementById('chart').style.display = "block";
        graf = true;
    }
    else
    {
        document.getElementById('chart').display = "none";
        graf = false;
    }

}




//////////////



setTimeout(
    function(){

       
    }
    , 10
)





//access the values of the brain of dinos: jurassic[0].brain.weigth_ho.data[0][0]
/*

setInterval(function(){

    
},15);
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