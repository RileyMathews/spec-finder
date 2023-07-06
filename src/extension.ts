// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { open } from 'fs';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "spec-finder" is now active!');

    const stripToBaseName = (fileName: string): string => {
        const baseName = fileName.split('/').pop();
        const baseNameWithoutExtension = baseName?.split('.')[0];
        if (!baseNameWithoutExtension) {
            throw new Error('No file is currently open');
        }
        return baseNameWithoutExtension;
    }

    const openFile = async (fileName: string) => {
        const document = await vscode.workspace.openTextDocument(fileName);
        // open the file in a right split view
        vscode.window.showTextDocument(document, vscode.ViewColumn.Two);
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('spec-finder.open-test-file', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // get the name of the currently open file
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            vscode.window.showErrorMessage('No file is currently open or does not have focus.');
            return;
        }

        const currentFileName = activeTextEditor.document.fileName;
        if (!currentFileName) {
            throw new Error('No file is currently open');
        }
        const fileBaseName = stripToBaseName(currentFileName);

        const files = await vscode.workspace.findFiles(`**/*${fileBaseName}*`);
        const filesWithOpenFileRemoved = files.filter(file => file.path !== currentFileName);
        const filesWithSameExtension = filesWithOpenFileRemoved.filter(file => file.path.split('.').pop() === activeTextEditor.document.fileName.split('.').pop());
        if (filesWithSameExtension.length === 0) {
            vscode.window.showErrorMessage('No test file found.');
            return;
        } else if (filesWithSameExtension.length === 1) {
            await openFile(filesWithSameExtension[0].path);
        } else {
            const fileNames = filesWithSameExtension.map(file => file.path);
            const selectedFile = await vscode.window.showQuickPick(fileNames);
            if (selectedFile) {
                await openFile(selectedFile);
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
