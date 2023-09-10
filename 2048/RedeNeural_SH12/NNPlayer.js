
class Player {

    constructor(){

        this.brain = new RedeNeural(16, 32, 6, 4);
        this.pontos = 0
    }

    static hibrido(a, b){
        //seleciona aleatoriamente características do A ou do B para o novo player
        let play = new Player();
        
        //bias
        for(let i=0; i<play.brain.bias_ho.data.length; i++){
            for(let j=0; j<play.brain.bias_ho.data[i].length; j++){
                if(Math.random() < 0.5){
                    play.brain.bias_ho.data[i][j] = a.brain.bias_ho.data[i][j];
                }
                else{
                    play.brain.bias_ho.data[i][j] = b.brain.bias_ho.data[i][j];
                }
            }
        }

        for(let k=0; k<play.brain.hide_layers - 1; k++){
            for(let i=0; i<play.brain.bias_hh[k].data.length; i++){
                for(let j=0; j<play.brain.bias_hh[k].data[i].length; j++){
                    if(Math.random() < 0.5){
                        play.brain.bias_hh[k].data[i][j] = a.brain.bias_hh[k].data[i][j];
                    }
                    else{
                        play.brain.bias_hh[k].data[i][j] = b.brain.bias_hh[k].data[i][j];
                    }
                }
            }
        }

        for(let i=0; i<play.brain.bias_ih.data.length; i++){
            for(let j=0; j<play.brain.bias_ih.data[i].length; j++){
                if(Math.random() < 0.5){
                    play.brain.bias_ih.data[i][j] = a.brain.bias_ih.data[i][j];
                }
                else{
                    play.brain.bias_ih.data[i][j] = b.brain.bias_ih.data[i][j];
                }
            }
        }


        //weigth
        for(let i=0; i<play.brain.weigth_ho.data.length; i++){
            for(let j=0; j<play.brain.weigth_ho.data[i].length; j++){
                if(Math.random() < 0.5){
                    play.brain.weigth_ho.data[i][j] = a.brain.weigth_ho.data[i][j];
                }
                else{
                    play.brain.weigth_ho.data[i][j] = b.brain.weigth_ho.data[i][j];
                }
            }
        }

        for(let k=0; k<play.brain.hide_layers - 1; k++){
            for(let i=0; i<play.brain.weigth_hh[k].data.length; i++){
                for(let j=0; j<play.brain.weigth_hh[k].data[i].length; j++){
                    if(Math.random() < 0.5){
                        play.brain.weigth_hh[k].data[i][j] = a.brain.weigth_hh[k].data[i][j];
                    }
                    else{
                        play.brain.weigth_hh[k].data[i][j] = b.brain.weigth_hh[k].data[i][j];
                    }
                }
            }
        }

        for(let i=0; i<play.brain.weigth_ih.data.length; i++){
            for(let j=0; j<play.brain.weigth_ih.data[i].length; j++){
                if(Math.random() < 0.5){
                    play.brain.weigth_ih.data[i][j] = a.brain.weigth_ih.data[i][j];
                }
                else{
                    play.brain.weigth_ih.data[i][j] = b.brain.weigth_ih.data[i][j];
                }
            }
        }


        return play;
    }


    mutar(fator)
    {

        for(let i=0; i<this.brain.bias_ho.data.length; i++){
            for(let j=0; j<this.brain.bias_ho.data[i].length; j++){
                if(Math.random() < 0.5){
                    this.brain.bias_ho.data[i][j] += Math.random() * fator;
                }
                else{
                    this.brain.bias_ho.data[i][j] -= Math.random() * fator;
                }
            }
        }

        for(let k=0; k<this.brain.hide_layers - 1; k++){
            for(let i=0; i<this.brain.bias_hh[k].data.length; i++){
                for(let j=0; j<this.brain.bias_hh[k].data[i].length; j++){
                    if(Math.random() < 0.5){
                        this.brain.bias_hh[k].data[i][j] += Math.random() * fator;
                    }
                    else{
                        this.brain.bias_hh[k].data[i][j] -= Math.random() * fator;
                    }
                }
            }
        }

        for(let i=0; i<this.brain.bias_ih.data.length; i++){
            for(let j=0; j<this.brain.bias_ih.data[i].length; j++){
                if(Math.random() < 0.5){
                    this.brain.bias_ih.data[i][j] += Math.random() * fator;
                }
                else{
                    this.brain.bias_ih.data[i][j] -= Math.random() * fator;
                }
            }
        }

        //weigth
        for(let i=0; i<this.brain.weigth_ho.data.length; i++){
            for(let j=0; j<this.brain.weigth_ho.data[i].length; j++){
                if(Math.random() < 0.5){
                    this.brain.weigth_ho.data[i][j] += Math.random() * fator;
                }
                else{
                    this.brain.weigth_ho.data[i][j] -= Math.random() * fator;
                }
            }
        }

        for(let k=0; k<this.brain.hide_layers - 1; k++){
            for(let i=0; i<this.brain.weigth_hh[k].data.length; i++){
                for(let j=0; j<this.brain.weigth_hh[k].data[i].length; j++){
                    if(Math.random() < 0.5){
                        this.brain.weigth_hh[k].data[i][j] += Math.random() * fator;
                    }
                    else{
                        this.brain.weigth_hh[k].data[i][j] -= Math.random() * fator;
                    }
                }
            }
        }

        for(let i=0; i<this.brain.weigth_ih.data.length; i++){
            for(let j=0; j<this.brain.weigth_ih.data[i].length; j++){
                if(Math.random() < 0.5){
                    this.brain.weigth_ih.data[i][j] += Math.random() * fator;
                }
                else{
                    this.brain.weigth_ih.data[i][j] -= Math.random() * fator;
                }
            }
        }

        
        
    }

}