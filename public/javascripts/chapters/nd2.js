$(function() {
    var logeq1 = [

        [1, "$( P \\to (Q \\to R))$", "Given, Want:$(P\\to Q)\\to (P\\to R)$", {
            "ass": true
        }],



    ]

    drawDeduction('#logeq1', logeq1)

    var logeq2 = [

        [1, "$( P \\to (Q \\to R))$", "Given, Want:$(P\\to Q)\\to (P\\to R)$", {
            "ass": true
        },],
        [2,"$P \\to Q$","Want: $P\\to R$",{
            "ass": true
        }],
        [3,"$P$","Want: $P\\to R$",{
            "ass": true
        }],
        [3,"$Q \\to R$"," $\\to E 1,3$"],
        [3,"$Q$"," $\\to E 2,3$"],
        [3,"$ R$"," $\\to E 4,5$"],
        [2,"$P \\to R$"," $\\to I 3-6$"],
        [1,"$(P \\to Q) \\to (P \\to R)$"," $\\to I 2-7$"]







    ]

    drawDeduction('#logeq2', logeq2)

    var taut = [

        [2, "$G\\wedge \\neg G$", "for reductio", {
            "ass": true
        }],
        [2,"G","$\\wedge E 1$"],
        [2,"$\\neg G$","$\\wedge E 1$"],
        [1,"$\\neg (G \\wedge \\neg G)$","$\\neg I 1-3$"]



    ]
    drawDeduction('#taut', taut)

    var derivedRules1 = [

        [1, "$A \\vee B$", "", {
            "ass": false
        }],
        [1,"$A \\to C$",""],
        [1,"$B \\to C$",""],
        [1,"$C$","$\\vee *,1,2,3$"]



    ]
    drawDeduction('#derivedRules1', derivedRules1)

    var derivedRules2 = [

        [1, "$A \\vee B$", "", {
            "ass": false
        }],
        [1,"$A \\to C$",""],
        [1,"$B \\to C$","",{
            "ass": true
        }],
        [2,"$\\neg C$","reductio",{
            "ass": true
        }],
        [3,"$\\neg A$","reductio",{
            "ass": true
        }],
        [3,"$B$","$\\vee E 2,5$"],
        [3,"$C$","$\\to E 3,6$"],
        [3,"$\\neg C $","$R$"],
        [2,"$ A $","$\\neg I 5-8$"],
        [2,"$ C $","$\\to E 2,10$"],
        [2,"$\\neg C $","$R$"],
        [1,"$C $","$\\neg I 4-12$"]








    ]
    drawDeduction('#derivedRules2', derivedRules2)
    mathJax.reload()
})
