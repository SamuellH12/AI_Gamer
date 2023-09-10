
class Dino {

    constructor(){

        this.brain = new RedeNeural(6, 6, 1);
        this.pontos = 0
    }

    static hibrido(a, b){
        //seleciona aleatoriamente características do A ou do B para o novo dinossauro
        let dino = new Dino();
        
        //bias
        for(let i=0; i<dino.brain.bias_ho.data.length; i++){
            for(let j=0; j<dino.brain.bias_ho.data[i].length; j++){
                if(Math.random() < 0.5){
                    dino.brain.bias_ho.data[i][j] = a.brain.bias_ho.data[i][j];
                }
                else{
                    dino.brain.bias_ho.data[i][j] = b.brain.bias_ho.data[i][j];
                }
            }
        }

        for(let i=0; i<dino.brain.bias_ih.data.length; i++){
            for(let j=0; j<dino.brain.bias_ih.data[i].length; j++){
                if(Math.random() < 0.5){
                    dino.brain.bias_ih.data[i][j] = a.brain.bias_ih.data[i][j];
                }
                else{
                    dino.brain.bias_ih.data[i][j] = b.brain.bias_ih.data[i][j];
                }
            }
        }

        //weigth
        for(let i=0; i<dino.brain.weigth_ho.data.length; i++){
            for(let j=0; j<dino.brain.weigth_ho.data[i].length; j++){
                if(Math.random() < 0.5){
                    dino.brain.weigth_ho.data[i][j] = a.brain.weigth_ho.data[i][j];
                }
                else{
                    dino.brain.weigth_ho.data[i][j] = b.brain.weigth_ho.data[i][j];
                }
            }
        }

        for(let i=0; i<dino.brain.weigth_ih.data.length; i++){
            for(let j=0; j<dino.brain.weigth_ih.data[i].length; j++){
                if(Math.random() < 0.5){
                    dino.brain.weigth_ih.data[i][j] = a.brain.weigth_ih.data[i][j];
                }
                else{
                    dino.brain.weigth_ih.data[i][j] = b.brain.weigth_ih.data[i][j];
                }
            }
        }


        return dino;
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