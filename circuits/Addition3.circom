pragma circom 2.0.0;

template Addition2()
{
   signal input a;
   signal input b;

   signal output res;

   res <== a + b;
}


template Addition3(){
   signal input a;
   signal input b;
   signal input c;
   signal output res;

   component mult1 = Addition2();
   component mult2 = Addition2();

   mult1.a <== a;
   mult1.b <== b;

   mult2.a <== mult1.res;
   mult2.b <== c;

   res <== mult2.res;
}

component main {public [c]} = Addition3();