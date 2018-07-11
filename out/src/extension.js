/*
 * author: 2gua.
 */
'use strict';
var vscode = require('vscode');
function activate(context) {
    var bracketsColors = ['#ab9df2', '#ff6188', '#fc9867', '#ffd866', '#a9dc76', '#78dce8'];
    var bracketsDecorationTypes = [];
    for (var index in bracketsColors) {
        bracketsDecorationTypes.push(vscode.window.createTextEditorDecorationType({
            color: bracketsColors[index]
        }));
    }
    var isolatedRightBracketsDecorationTypes = vscode.window.createTextEditorDecorationType({
        backgroundColor: "#5f0000",
        color: "#da3c50"
    });
    var activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        rainbowBrackets();
    }
    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            rainbowBrackets();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            rainbowBrackets();
        }
    }, null, context.subscriptions);
    function rainbowBrackets() {
        if (!activeEditor) {
            return;
        }
        var text = activeEditor.document.getText();
        var regEx = /[\(\)\[\]\{\}]/g;
        var match;
        var bracketsColorCount = 0;
        var leftRoundBracketsStack = [];
        var leftSquareBracketsStack = [];
        var leftSquigglyBracketsStack = [];
        var bracketsDecorationTypeMap = {};
        for (var index in bracketsDecorationTypes) {
            bracketsDecorationTypeMap[index] = [];
        }
        ;
        var rightBracketsDecorationTypes = [];
        var calculate;
        while (match = regEx.exec(text)) {
            var startPos = activeEditor.document.positionAt(match.index);
            var endPos = activeEditor.document.positionAt(match.index + 1);
            var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: null };
            switch (match[0]) {
                case '(':
                    calculate = bracketsColorCount;
                    leftRoundBracketsStack.push(calculate);
                    bracketsColorCount++;
                    if (bracketsColorCount >= bracketsColors.length) {
                        bracketsColorCount = 0;
                    }
                    bracketsDecorationTypeMap[calculate].push(decoration);
                    break;
                case '[':
                calculate = bracketsColorCount;
                    leftSquareBracketsStack.push(calculate);
                    bracketsColorCount++;
                    if (bracketsColorCount >= bracketsColors.length) {
                        bracketsColorCount = 0;
                    }
                    bracketsDecorationTypeMap[calculate].push(decoration);
                    break;
                case '{':
                    calculate = bracketsColorCount;
                    leftSquigglyBracketsStack.push(calculate);
                    bracketsColorCount++;
                    if (bracketsColorCount >= bracketsColors.length) {
                        bracketsColorCount = 0;
                    }
                    bracketsDecorationTypeMap[calculate].push(decoration);
                    break;
                case ')':
                    if (leftRoundBracketsStack.length > 0) {
                        calculate = leftRoundBracketsStack.pop();
                        bracketsColorCount = calculate;
                        bracketsDecorationTypeMap[calculate].push(decoration);
                    }
                    else {
                        rightBracketsDecorationTypes.push(decoration);
                    }
                    break;
                case ']':
                    if (leftSquareBracketsStack.length > 0) {
                        calculate = leftSquareBracketsStack.pop();
                        bracketsColorCount = calculate;
                        bracketsDecorationTypeMap[calculate].push(decoration);
                    }
                    else {
                        rightBracketsDecorationTypes.push(decoration);
                    }
                    break;
                case '}':
                    if (leftSquigglyBracketsStack.length > 0) {
                        calculate = leftSquigglyBracketsStack.pop();
                        bracketsColorCount = calculate;
                        bracketsDecorationTypeMap[calculate].push(decoration);
                    }
                    else {
                        rightBracketsDecorationTypes.push(decoration);
                    }
                    break;
                default:
            }
        }
        for (var index in bracketsDecorationTypes) {
            activeEditor.setDecorations(bracketsDecorationTypes[index], bracketsDecorationTypeMap[index]);
        }
        activeEditor.setDecorations(isolatedRightBracketsDecorationTypes, rightBracketsDecorationTypes);
    }
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map