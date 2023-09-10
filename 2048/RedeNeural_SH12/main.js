var once = -1;
var contouObs = false;
var gameOver = false;
var equipe = []; //geração atual
var qtdPlayers = 15; //quantidade de jogadores por geração
var qtdPlayersNextGen = qtdPlayers; //para ser possível alterar o valor da próxima geração sem impactar a atual
var pAtual = 0; //jogador que tá jogando agora
var gen = 0; //geração atual
var qtdGens = 20;
var escolhidosPorGen = 2;
var taxaDeMutacao = 0.2;
var autoPass = true;
const win = this.window;
var cnt = 0;
var graf = false;
var velocity = 10

function inicializar()  //-1
{  
    for(let i=0; i<qtdPlayers; i++)
    {
        let pl = new Player();
        equipe.push(pl);
    }
    
    once = 0;
}    

function signoid(x){
    return 1/(1 + Math.exp(-x));
}


function seleciona() //-1
{
    //ordena pela  pontuação
    equipe.sort(  function (a,b) {
        if(a.pontos < b.pontos){ return +1; }
        else
        if(a.pontos > b.pontos){ return -1; }
        return 0;
    });

    let mx=equipe[0].pontos, mn=equipe[equipe.length - 1].pontos, mediun=0;
    for(let i=0; i<equipe.length; i++){
        mediun += equipe[i].pontos;
    }
    mediun /= equipe.length;

    //grafico
    
    console.log("Nuns")
    console.log(mx, mn, mediun)
    Plotly.extendTraces('chart',{ y:[[mx], [mn], [mediun]]}, [0, 1, 2]);
    //Plotly.extendTraces('chart',{ y:[[mx, mn, mediun]]}, [0, 1, 2]);
    cnt++;
    // if(cnt > 60) {
    //     Plotly.relayout('chart',{ xaxis: {range: [cnt-50,cnt+10]}  } );
    // }
    


    console.log("Placar ->")
    console.table(equipe);
    
    console.log("Entrando no Lab");

    //pega os melhores da geração
    let melhores = [];
    for(let i=0; i<escolhidosPorGen; i++){
        equipe[i].pontos = 0;
        melhores.push(equipe[i]);
    }

    equipe = melhores;

    //SEM criar híbridos
    let i = 0;
    while( equipe.length < qtdPlayers )
    {
        equipe.push(melhores[i])
        i++;
        if( i == escolhidosPorGen){ i=0; } //se a quantidade de players ainda não tiver completa, volta ao começo
    }
    
    console.log("Clones gerados");
    
    //gerar mutações
    for(let i=escolhidosPorGen; i<equipe.length; i++)
    {
        equipe[i].mutar(taxaDeMutacao);
    }

    console.log("Mutantes gerados");
    document.getElementById("textolog").innerHTML = "New Generation Ready!";

    once = 0; //start a new game
}

function startGame()    //0
{
    if(pAtual == qtdPlayers)
    { 
        gen++;
        pAtual = 0;
        once = -1; //se já testei todos os players em vez de restart vou para a seleção dos melhores
        return;
    }    

    //da start no jogo
    

    document.getElementById('InfoGerenation').innerHTML = "Player Atual: " + pAtual + " Gen:" + (gen + 1);

    once = 1;   //e que comecem os jogos!!!
}    

function getInput()
{
    let grid = [];
    
    for(let i=1; i <= 4; i++)
    {
        for(let j=1; j <= 4; j++)
        {
            //tile-position-2-3
            let val = 0;

            let cell = document.getElementsByClassName("tile-position-"+i.toString()+"-"+j.toString()+"");

            if(cell.length > 0)
            {
                val = Math.log2( parseInt(cell[0].children[0].innerHTML) );
            }

            grid.push(val);
        }
    }

    return grid;
}

var manager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
var lstIn = []
var ignoreDirs = 0

function testaPlayer()   //1
{
    if( document.getElementsByClassName("game-over").length > 0 )
    {
        equipe[pAtual].pontos = parseInt( document.getElementsByClassName("score-container")[0].innerHTML )
        console.log("Player", pAtual ,"perdeu (T-T)  -> ", equipe[pAtual].pontos, " pontos");
        document.getElementById("textolog").innerHTML = "GAME OVER";
        once = 0;
        pAtual++;
        manager.inputManager.events.restart[0]();
        return;
    }    

    //pega os inputs
    let input = getInput();

    let comando = equipe[pAtual].brain.predict( input );

    //console.log("at", input.toString())
    //console.log("lst", lstIn.toString())
    //console.log(lstIn.toString() == input.toString())

    if(input.toString() === lstIn.toString())
    {
        
        ignoreDirs++;
        for(let d=0; d < ignoreDirs; d++)
        {   
            let mx = comando[0], idx = 0
            
            for(let i=0; i < comando.length; i++)
            {
                if(comando[i] > mx)
                {
                    idx = i
                    mx = comando[i]
                }
            }
            
            comando[idx] = -99999999999999999
        }

        //console.log(ignoreDirs)
    }
    else
    {
        ignoreDirs = 0;
    }

    lstIn = input
    
    //envia os comandos para o jogo
    if(comando[0] >= comando[1] && comando[0] >= comando[2] && comando[0] >= comando[3])
    {
        //up
        //simulateKey(38);
        manager.inputManager.events.move[0](0);
    }
    else
    if(comando[1] >= comando[0] && comando[1] >= comando[2] && comando[1] >= comando[3])
    {
        //down
        //simulateKey(40);
        manager.inputManager.events.move[0](1);
    }
    else
    if(comando[2] >= comando[0] && comando[2] >= comando[1] && comando[2] >= comando[3])
    {
        //left
        //simulateKey(37);
        manager.inputManager.events.move[0](2);
    }
    else
    if(comando[3] >= comando[0] && comando[3] >= comando[1] && comando[3] >= comando[2])
    {
        //rigth
        //simulateKey(39);
        manager.inputManager.events.move[0](3);
    }  
}    



function main(){
    setTimeout( function(){

        if(gen == qtdGens)
        {
            document.getElementById("restartGen").style.display = "block";
            console.log(equipe);
            return;
        }

        if( once ==-1 ) //pre game -> inicializar valores ou gerar nova geração
        {

            qtdPlayers = qtdPlayersNextGen;
            if(gen == 0){ 
                inicializar(); 
                showGraph();
                Plotly.newPlot('chart',[{y:[0], type:'line', name: 'mx'}, {y:[0], type:'line', name: 'mn'}, {y:[0], type:'line', name: 'mediun'}]); 
                //Plotly.extendTraces('chart',{ y:[[10], [15], [20]]}, [0, 1, 2]);
                //Plotly.extendTraces('chart',{ y:[[0, 1, 2]]}, [0, 1, 2]);
            }
            else
            {
                if(autoPass){ seleciona(); }
                else{ document.getElementById("continue").style.display = "block";}
            }
        }
        else
        if( once == 0){ startGame(); } //0
        else
        if( once == 1){ testaPlayer(); } //1
        
        main();
    } ,velocity);
}






/***************************
*   User Interface - UI
***************************/

setTimeout( function()
{
    document.getElementById('InfosAI').innerHTML = `
    <div style="display: flex; flex-direction: column;" >
    <div style="display: block; width: 40vw;">
        <h1 style="margin: 0;"> 2048 AI </h1>
        <h3 style="margin-top: 0;"> by <a href="https://github.com/SamuellH12"> SamuellH12 </a> </h3>
        
      <div>Velocity:       <input id="velocityGame" type='number' value=10> </div>
      <div>Players Per Gen:       <input id="dinPGen" type='number' value=15> </div>
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
      <button id="downButton" style="display: none" onClick="showDownUp(1)"> Upload a Player       </button>
      <button id="upButton"   style="display: none" onClick="showDownUp(2)"> Download a Player     </button>
      <input  id="dinoDown"   style="display: none" type='number' >
      <input  id="dinoUp"     style="display: none" type='text'   hint="dino.JSON">
      <button id="confirmDown"style="display: none" onClick="download()">           Confirm      </button>
      <button id="confirmUp"  style="display: none" onClick="upload()">             Confirm      </button>
        
      <h3 id="InfoGerenation"></h3>

    </div>

    <div id="chart" style="width: 50vw; height:50vh"></div>

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
    pAtual = 0;
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
    velocity = parseInt( document.getElementById("velocityGame").value, 10 );
    qtdPlayersNextGen = parseInt( document.getElementById("dinPGen").value, 10 );
    qtdGens = parseInt( document.getElementById("nGen").value, 10 );
    escolhidosPorGen =  parseInt( document.getElementById("selec").value, 10 );
    taxaDeMutacao = parseFloat( document.getElementById("taxa").value )
    autoPass = document.getElementById("autoPassYes").checked;
    document.getElementById("textolog").innerHTML = "Options Saved!";
}

function download(n)
{
    let numDino = parseInt( document.getElementById("dinoDown").value, 10 );

    if(numDino < qtdPlayers){
        saveAs(new Blob( [ JSON.stringify(equipe[numDino]) ], 
        { type: "text/plain;charset=utf-8" }), 
        "Dino"+numDino+"_Gen"+(gen+1)+"_Score"+equipe[numDino].pontos+".txt");
        document.getElementById("textolog").innerHTML = "Successfully Downloaded!";
    }
    else
    {
        document.getElementById("textolog").innerHTML = "Error! Number must be between 0 and "+(qtdPlayers-1);
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
    equipe.push(newDino);
    qtdPlayers++;
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
        document.getElementById('chart').style.display = "block";
        graf = true;
    }
    else
    {
        document.getElementById('chart').display = "none";
        graf = false;
    }

}


