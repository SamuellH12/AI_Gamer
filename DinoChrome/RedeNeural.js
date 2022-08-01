//Funções signoid e derivada signoid
function signoid(x){
    return 1/(1 + Math.exp(-x));
}

function deriv_sigmoid(x){
    return x * (1-x);
}

function lreLu(x)
{
    if( x >= 0){ return x; }
    else{ return 0.01 * x; }
}

function deriv_lreLu(x)
{
    if( x < 0 ){ return 0.01; }
    else { return 1; }
}

//CLASSE REDE NEURAL
//Dividida basicamente em train e predict, além do construtor da classe, claro. Mais explicações a seguir:
class RedeNeural {

    //CONSTRUCTOR: recebe três parâmetros, respectivamente: o número de nós da entrada, o número de nós da camada intermediária
    // e o número de nós da camada de saída. Aqui só há uma camada oculta. Além disso há outras variáveis, veja abaixo:
    constructor( in_nodes, hide_nodes, out_nodes) {

        //NÚMERO DE NÓS
        this.in_nodes   = in_nodes;
        this.hide_nodes = hide_nodes;
        this.out_nodes  = out_nodes;

        //BIAS
        this.bias_ih = new Matrix(hide_nodes, 1);   //bias dos nós de input para a camada oculta (hidden). 
        this.bias_ho = new Matrix(out_nodes, 1);    //bias dos nós da camada oculta para o output.
        this.bias_ih.randomize();           //valores do bias são inicialmente aleatórios
        this.bias_ho.randomize();           //ao longo do treinamento esses valores serão ajustados

        //PESOS
        this.weigth_ih = new Matrix(this.hide_nodes, this.in_nodes);    //o peso de  cada nó do input para cada nó do hide
        this.weigth_ho = new Matrix(this.out_nodes, this.hide_nodes);   //o peso de cada nó do hide para cada nó do output
        this.weigth_ih.randomize();         //valores inicialmente aleatórios
        this.weigth_ho.randomize();         //durante o treinamento esses valores serão ajustados, assim como o bias

        this.learning_rate = 0.1;   //taxa de aprendizagem, o que deve controlar o tamanho das alterações feitas nos pesos e bias durante o train
    }



    //PREDICT -> pega um input e aplica ele na rede neural pra encontrar a resposta, ou seja, a predição
    predict( arr ){
        let input = Matrix.arrayToMatrix( arr );                //transforma o input numa matriz

        //Processa os valores que vêm do INPUT para a OCULTA
        let hidden = Matrix.multiply(this.weigth_ih, input );   //multiplica os PESOS entrada->oculta pela matriz do input
        hidden = Matrix.add(hidden, this.bias_ih);              //adiciona o bias com uma soma simples ao resultado da operação
        hidden.map( lreLu )                                   //coloca o resultado na função de ativação, nesse caso a signoid


        //processa os valores que vieram da camada OCULTA para o OUTPUT
        let output = Matrix.multiply(this.weigth_ho, hidden);   //multiplica os PESOS oculta->saída pela matriz que veio da oculta (que acabamos de processar)
        output = Matrix.add(output, this.bias_ho);              //adiciona o respectivo bias aqui também
        output.map( lreLu );                                    //pega essa matriz e passa ela pela função de ativação
        

        output = Matrix.MatrixToArray(output);  //transforma nosso output em um array
        return output;                          //e devolve ele a quem o chamou
    }

    //o cálculo é equivalente a uma função linear:
    //f(x) = bias  + x * weigth
    //f(x) = const + x * n


    //TRAIN -> recebe um input e o output esperado, vai então calcular a resposta da nossa rede e comparar
    //com a resposta esperada, para então corrigir os valores dos nossos pesos e bias através de backpropagation
    train(arr, target) {

        //FEED FOARWARD -> equivalente a PREDICT, calcula qual seria a saída de nossa rede (na situação atual) para um dado input 
        
        let input = Matrix.arrayToMatrix( arr );

        let hidden = Matrix.multiply(this.weigth_ih, input );
        hidden = Matrix.add(hidden, this.bias_ih);              //calcula a passagem do input pra camada oculta (ver detalhes em PREDICT)
        hidden.map( lreLu )

        let output = Matrix.multiply(this.weigth_ho, hidden);
        output = Matrix.add(output, this.bias_ho);              //calcula a passagem da oculta pro output (ver detalhes em PREDICT)
        output.map( lreLu );


        //BACKPROPAGATION -> vai retornando e calculando o que precisa ser alterado na rede.

        //OUT - HIDE ------                                        //importante: derivada = taxa de variação de uma função   y = f(x) em relação à x, dada pela relação ∆x/∆y
        let expected = Matrix.arrayToMatrix(target);        //transforma nossa saída esperada em uma matriz
        let output_error = Matrix.sub(expected, output);   //calcula o erro da saída, que é: nossa saída esperada menos a saída da rede (calculada acima)
        let deriv_out = Matrix.map(output, deriv_lreLu );  //cria uma derivada do nosso erro de saída, passando nosso valores pela derivada da função de ativação
        
        let gradiant = Matrix.hadamard(deriv_out, output_error);     //calcula as alterações necessárias multiplicando(em hadamard) a derivada do erro de saída pelo próprio erro 
        gradiant = Matrix.esc_multiply(gradiant, this.learning_rate);//e depois multiplica por nosso learning rate, para controlar o tamanho  das alterações

        this.bias_ho = Matrix.add(this.bias_ho, gradiant);           //adiciona ao nosso bias do hide pro out as alterações

        let hidden_T = Matrix.transpose(hidden)                      //transpõe a matriz que vem do hide (os cálculos que que foram feitos do in pro hide)
        let weigth_ho_delta = Matrix.multiply(gradiant, hidden_T);   //multiplica nossas alterações necessárias pela transposta acima (o "pré resultado da nossa rede") 
        this.weigth_ho = Matrix.add(this.weigth_ho, weigth_ho_delta);//adiciona a variação aos pesos do hide-out para "corrigir" nossos pesos


        //HIDE - IN ------
        let weigth_ho_T = Matrix.transpose(this.weigth_ho);             //pega uma transposta da nossa matriz de pesos do hide-out
        let hidden_error = Matrix.multiply(weigth_ho_T, output_error);  //gera o erro da nossa oculta multiplicando os pesos da oculta pelo nosso erro de saída
        let deriv_hide = Matrix.map( hidden, deriv_lreLu );            //cria uma derivada do erro da oculta com a função derivada sigmoid

        let gradiant_hide = Matrix.hadamard(deriv_hide, hidden_error);  //cria nossa matriz com as alterações que serão feitas
        gradiant_hide = Matrix.esc_multiply(gradiant_hide, this.learning_rate); //e multiplica ela pelo learning rate

        this.bias_ih = Matrix.add(this.bias_ih, gradiant_hide);         //adiciona nossas alterações ao bias

        let input_T = Matrix.transpose(input);                          //transpõe nosso input (a matriz que vem do input)
        let weigth_ih_delta = Matrix.multiply(gradiant_hide, input_T);  //calcula a alteração necessária aos pesos (que é nossa alteração*input_Transposto)
        this.weigth_ih = Matrix.add(this.weigth_ih, weigth_ih_delta);   //adiciona esse valor ao nosso peso do input pro hide

    }

    //basicamente o train:
    //calcula a resposta que nossa rede daria pra um input
    //pega esse valor e compara com o valor que era esperado
    //corrige o bias e o weigth que vai do output pro hide pela diferença da saída pro esperado 
    //corrige o bias e o weigth que vem do hide pro input  pela diferença do erro pelas correções feitas na camada anterior 


}
