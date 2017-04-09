$(function() {
    var ue1 = [

        [1, "$\\forall \\chi \\Psi$", "", {
            "ass": false
        }],
        [1,"$\\Psi[\\alpha|\\chi]$",""]

    ]

    drawDeduction('#ue1', ue1)


    var ue2 = [

        [1, "$\\forall (Mx \\to Rxd)$", "given", {
            "ass": true
        }],
        [1,"$(Ma \\to Rad)$","$\\forall E 1$"],
        [1,"$(Md \\to Rdd)$","$\\forall E 1$"]

    ]

    drawDeduction('#ue2', ue2)

    var ei1 = [

        [1, "$(Ma \\to Rad)$", "given", {
            "ass": true
        }],
        [1,"$\\exists x (Mx \\to Rxd)$","$\\exists I 1$"],
        [1,"$\\exists y \\exists x (Mx \\to Rxy)$","$\\exists I 2$"]


    ]

    drawDeduction('#ei1', ei1)

    // var ui1 = [
    //
    //     [1, "$\\forall x Mx$", "given", {
    //         "ass": false
    //     }],
    //     [1,"$Ma$","$1 \\forall E$"]
    //
    // ]



      var ui1 = [

          [1, "$\\forall x Mx$", "given", {
              "ass": false
          }],
          [1,"$Ma$","$1 \\forall E$"],
          [1,"$\\forall y My$","$2 \\forall I$"]

      ]



        var ui2 = [

            [1, "$\\forall x Rxa$", "given", {
                "ass": false
            }],
            [1,"$Raa$","$1 \\forall E$"],
            [1,"$\\forall y Ryy$","Not allowed!!!!"]

        ]
        drawDeduction('#ui1', ui1)
        drawDeduction('#ui2', ui2)


        var ee1 = [

            [1, "$\\exists \\chi \\Psi$", "", {
                "ass": false
            }],
            [2,"$\\Psi[\\alpha|\\chi]$","assumption",{"ass":true}],
            [2,"$\\Phi$","..."],
            [1,"$\\Phi$","\\exists E$, 2-3"]

        ]
          drawDeduction('#ee1', ee1)

          var ee2 = [

              [1, "$\\exists x Sx$", "", {
                  "ass": false
              }],
              [1, "$\\forall x (Sx \\to Tx)$", "", {
                  "ass": true
              }],
              [2,"$Sa$","assumption",{"ass":true}],
              [2,"$Sa \\to Ta$","$\\forall E$ 2"],
              [2,"$Ta$","$\\to E$ 3,4"],
              [2,"$\\exists x Tx$","$\\exists I$ 5"],
              [1,"$\\exists x Tx$","$\\exists E$, 3-5"]

          ]
            drawDeduction('#ee2', ee2)
    //
    // var logeq2 = [
    //
    //     [1, "$( P \\to (Q \\to R))$", "Given, Want:$(P\\to Q)\\to (P\\to R)$", {
    //         "ass": true
    //     },],
    //     [2,"$P \\to Q$","Want: $P\\to R$",{
    //         "ass": true
    //     }],
    //     [3,"$P$","Want: $P\\to R$",{
    //         "ass": true
    //     }],
    //     [3,"$Q \\to R$"," $\\to E 1,3$"],
    //     [3,"$Q$"," $\\to E 2,3$"],
    //     [3,"$ R$"," $\\to E 4,5$"],
    //     [2,"$P \\to R$"," $\\to I 3-6$"],
    //     [1,"$(P \\to Q) \\to (P \\to R)$"," $\\to I 2-7$"]
    //
    //
    //
    //
    //
    //
    //
    // ]
    //
    // drawDeduction('#logeq2', logeq2)
    //
    // var taut = [
    //
    //     [2, "$G\\wedge \\neg G$", "for reductio", {
    //         "ass": true
    //     }],
    //     [2,"G","$\\wedge E 1$"],
    //     [2,"$\\neg G$","$\\wedge E 1$"],
    //     [1,"$\\neg (G \\wedge \\neg G)$","$\\neg I 1-3$"]
    //
    //
    //
    // ]
    // drawDeduction('#taut', taut)
    //
    // var derivedRules1 = [
    //
    //     [1, "$A \\vee B$", "", {
    //         "ass": false
    //     }],
    //     [1,"$A \\to C$",""],
    //     [1,"$B \\to C$",""],
    //     [1,"$C$","$\\vee *,1,2,3$"]
    //
    //
    //
    // ]
    // drawDeduction('#derivedRules1', derivedRules1)
    //
    // var derivedRules2 = [
    //
    //     [1, "$A \\vee B$", "", {
    //         "ass": false
    //     }],
    //     [1,"$A \\to C$",""],
    //     [1,"$B \\to C$","",{
    //         "ass": true
    //     }],
    //     [2,"$\\neg C$","reductio",{
    //         "ass": true
    //     }],
    //     [3,"$\\neg A$","reductio",{
    //         "ass": true
    //     }],
    //     [3,"$B$","$\\vee E 2,5$"],
    //     [3,"$C$","$\\to E 3,6$"],
    //     [3,"$\\neg C $","$R$"],
    //     [2,"$ A $","$\\neg I 5-8$"],
    //     [2,"$ C $","$\\to E 2,10$"],
    //     [2,"$\\neg C $","$R, 4$"],
    //     [1,"$C $","$\\neg I 4-12$"]
    //
    //
    //
    //
    //
    //
    //
    //
    // ]
    // drawDeduction('#derivedRules2', derivedRules2)
    mathJax.reload()
})
