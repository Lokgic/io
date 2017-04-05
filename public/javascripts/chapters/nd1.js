$(function() {
    var fitch1 = [

        [1, "$(\\neg L \\to (J \\vee L))$", "Given", {
            "hoverable": false
        }],
        [1, "$\\neg L$", "Given, Want: J", {
            "ass": true
        }],
        [1, "", ""]


    ]

    drawDeduction('#fitch1', fitch1)


    var fitch2 = [

        [1, "$(\\neg L \\to (J \\vee L))$", "Given", {
            "hoverable": false
        }],
        [1, "$\\neg L$", "Given, Want: J", {
            "ass": true
        }],
        [1, "$J \\vee L$", "$\\to E$ 1,2"],
        [1, "$J$", "$\\vee E$ 2,3"]


    ]

    drawDeduction('#fitch2', fitch2)

    var re = [


        [1, "$\\phi$", ""],
        [1, "$\\phi$", "$R,1$"]



    ]

    drawDeduction('#reiteration', re)
    var con1 = [


        [1, "$\\phi$", ""],
        [1, "$\\psi$", ""],
        [1, "$\\phi \\wedge \\psi$", "$\\wedge I 1,2$"]



    ]
    drawDeduction('#conjunction1', con1)


    var con2 = [


        [1, "$\\phi \\wedge \\psi$", ""],
        [1, "$\\phi$", "$\\wedge E 1$"]




    ]
    drawDeduction('#conjunction2', con2)

    var con3 = [


        [1, "$A \\wedge (B \\vee C)$", ""],
        [1, "$A$", "$\\wedge E 1$"],
        [1, "$(B \\vee C)$", "$\\wedge E 1$"]




    ]
    drawDeduction('#conjunction3', con3)


    var con4 = [


        [1, "$[(A\\vee B)\\to (C \\vee D)] \\wedge [(E \\vee F) \\to (G \\vee H)] $", "Given"],
        [1, "$[(A\\vee B)\\to (C \\vee D)]$", "$\\wedge E 1$"],
        [1, "$[(E \\vee F) \\to (G \\vee H)]$", "$\\wedge E 1$"],
        [1, "$ [(E \\vee F) \\to (G \\vee H)] \\wedge (A\\vee B)\\to (C \\vee D)]$", "$\\wedge I 2,3$"]




    ]
    drawDeduction('#conjunction4', con4)
    var dis1 = [

        [1, "$\\phi$", ""],
        [1, "$\\phi \\vee \\psi$", "$\\vee I 1$"]

    ]

    var dis2 = [

        [1, "$\\phi$", ""],
        [1, "$\\psi \\vee \\phi$", "$\\vee I 1$"]

    ]

    drawDeduction('#disjunction1', dis1)

    drawDeduction('#disjunction2', dis2)

    var dis3 = [

        [1, "$M$", ""],
        [1, "$M \\vee (A \\leftrightarrow (E\\wedge G))", "$\\vee I 1$"]

    ]

    var dis4 = [

        [1, "$\\phi \\vee \\psi$", ""],
        [1, "$ \\neg \\phi$", ""],
        [1, "$ \\psi$", "$\\vee E 1,2$"]

    ]

    var dis5 = [

        [1, "$\\phi \\vee \\psi$", ""],
        [1, "$ \\neg \\psi$", ""],
        [1, "$ \\phi$", "$\\vee E 1,2$"]

    ]
drawDeduction('#disjunction4', dis4)
    drawDeduction('#disjunction5', dis5)



    var conditional1 = [

        [1, "$\\phi \\to \\psi$", ""],
        [1, "$ \\phi$", ""],
        [1, "$ \\psi$", "$\\to E 1,2$"]

    ]

    drawDeduction('#conditional1', conditional1)

    var biconditional1 = [

        [1, "$\\phi \\leftrightarrow \\psi$", ""],
        [1, "$ \\phi$", ""],
        [1, "$ \\psi$", "$\\leftrightarrow E 1,2$"]

    ]

    var biconditional2 = [

        [1, "$\\phi \\leftrightarrow \\psi$", ""],
        [1, "$ \\psi$", ""],
        [1, "$ \\phi$", "$\\leftrightarrow E 1,2$"]

    ]
    drawDeduction('#biconditional1', biconditional1)
    drawDeduction('#biconditional2', biconditional2)

    var conIntro1 = [

        [1, "$R \\vee F$", "Given, Want $\\neg R \\to F$",{"ass": true}],
        [2, "$ \\neg R$", "Assumption, Want: F"]

    ]
    drawDeduction('#conIntro1', conIntro1)


    var conIntro2 = [

        [1, "$R \\vee F$", "Given, Want $\\neg R \\to F$",{"ass": true}],
        [2, "$ \\neg R$", "Assumption, Want: F"],
        [2,"F","$\\vee E 1,2$"],
        [1,"$\\neg R \\to F$","$\\to I 2,3$"]

    ]
    drawDeduction('#conIntro2', conIntro2)
    var conIntro3 = [


        [2, "$ \\phi$", "Assumption, Want: $\\psi$"],
        [2,"...","..."],
        [2,"$\\psi$","$"],
        [1,"$\\phi \\to \\phi$","$\\to I 1,2-3$"]

    ]
    drawDeduction('#conIntro3', conIntro3)
    var conIntro4 = [


        [1, "$\\phi$", "",{"ass": true}],
        [2,"B","...",{"ass": true}]

    ]
    drawDeduction('#conIntro4', conIntro4)
    var conIntro5 = [


        [1, "$\\phi$", "",{"ass": true}],
        [2,"$\\psi$","...",{"ass": true}],
        [2,"$\\psi$","2 R"],
        [1,"$\\psi$","3, R"]

    ]
    drawDeduction('#conIntro5', conIntro5)

    var biIntro1 = [


        [2, "$\\phi$", "",{"ass": true}],
        [2,"$\\psi$"],
        [2,"$\\psi$","",{"ass": true}],
        [2,"$\\phi$",""],
        [1,"$\\phi \\leftrightarrow \\psi$","$1-4, \\leftrightarrow I$"]

    ]
    drawDeduction('#biIntro1', biIntro1)

    var reductio1 = [


        [2, "$\\phi$", "for reductio",{"ass": true}],
        [2,"$\\psi$"],
        [2,"$\\neg \\psi$"],
        [1,"$\\neg \\phi$","$1,2-3, \\neg I$"]

    ]
    drawDeduction('#reductio1', reductio1)

    var reductio2 = [


        [1, "$A$", "Given, Want: $\\neg \\neg A$",{"ass": true}],
        [2, "$\\neg A$", "Assumption for reductio",{"ass": true}],
        [2,"$A$","R 1"],
        [2,"$\\neg A$","R 2"],
        [1,"$\\neg \\neg A$","$1,2-4, \\neg I$"]

    ]
    drawDeduction('#reductio2', reductio2)


    var reductio3 = [


        [2, "$\\neg \\phi$", "for reductio",{"ass": true}],
        [2,"$\\psi$"],
        [2,"$\\neg \\psi$"],
        [1,"$ \\phi$","$1,2-3, \\neg E$"]

    ]
    drawDeduction('#reductio3', reductio3)
    mathJax.reload()
})
