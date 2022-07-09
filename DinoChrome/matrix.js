//Classe matrix que é responsável por criar e pelos cálculos envolvendo matrizes

class Matrix {

    constructor(rows, cols) {

        this.rows = rows;
        this.cols = cols;

        this.data = [];

        for (let i = 0; i < rows; i++) 
        {
            let arr = [];
            for (let e=0; e<cols; e++) 
            {
                arr.push(0);
            }

            this.data.push(arr);
        } 

    }

    static arrayToMatrix(arr) {
        let matrix = new Matrix(arr.length, 1);
    
        matrix.map( (elm, i, j) => {
            return arr[i];
        } );

        return matrix;
    }

    static MatrixToArray(obj) {
        let arr = []
        obj.map((elm, i, j) => {
            arr.push(elm);
        })
        return arr;
    }

    print(){
        console.log(this.data);
    }
    randomize(){
        this.map( (elm, i, j) => {
            return Math.random() * 2 - 1;
        } );
    }

    static map(A, func) {
        let matrix = new Matrix(A.rows, A.cols);

        matrix.data = A.data.map( (array, i) => {
            return array.map( (num, j) => {
                 return func(num, i, j);
            });
        });

        return matrix;
    }

    map(func) {

        this.data = this.data.map( (array, i) => {
            return array.map( (num, j) => {
                 return func(num, i, j);
            });
        });

        return this;
    }

    // transposição
    static transpose(A){
        let matrix = new Matrix(A.cols, A.rows);

        matrix.map( (num, i, j) => {
            return A.data[j][i];
        } );

        return matrix;
    }


    // matriz por escalar

    static esc_multiply(A, escalar){
        let matrix = new Matrix(A.rows, A.cols);
        matrix.map( (num, i, j) => {
            return A.data[i][j] * escalar;
        });

        return matrix;
    }


    //matriz por matriz

    static hadamard(A, B){
        let matrix = new Matrix(A.rows, A.cols);
         
        matrix.map( (num, i, j) => {
            return A.data[i][j] * B.data[i][j];
        });

        return matrix;
    }

    static add(A, B){
        let matrix = new Matrix(A.rows, A.cols);
        matrix.map( (num, i, j) => {
            return A.data[i][j] + B.data[i][j];
        });

        return matrix;
    }

    static sub(A, B){
        let matrix = new Matrix(A.rows, A.cols);
        matrix.map( (num, i, j) => {
            return A.data[i][j] - B.data[i][j];
        });

        return matrix;
    }

    static multiply(A, B) {
        let matrix = new Matrix(A.rows, B.cols);

        matrix.map( (num, i, j) => {

            let sum = 0;
            for(let k=0; k<A.cols; k++)
            {
                sum += A.data[i][k] * B.data[k][j];
            }
            return sum;
        } );

        return matrix;
        
    }

}


