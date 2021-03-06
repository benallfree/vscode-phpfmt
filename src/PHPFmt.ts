import {
  workspace as Workspace,
  window as Window,
  ExtensionContext
} from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { execSync, spawn, ChildProcess } from 'child_process';
import * as detectIndent from 'detect-indent';
import IPHPFmtConfig from './IPHPFmtConfig';
import Widget from './Widget';

class PHPFmt {
  private widget: Widget;
  private config: IPHPFmtConfig;
  private args: Array<string> = [];

  public static pharRelPath: string = 'vendor/phpfmt-next/fmt/bin/fmt.phar';

  public constructor() {
    this.loadSettings();
    this.widget = Widget.getInstance(this);
  }

  public loadSettings(): void {
    this.config = Workspace.getConfiguration('phpfmt') as any;
    this.args.length = 0;

    if (this.config.custom_arguments !== '') {
      this.args.push(this.config.custom_arguments);
      return;
    }

    if (this.config.psr1) {
      this.args.push('--psr1');
    }

    if (this.config.psr1_naming) {
      this.args.push('--psr1-naming');
    }

    if (this.config.psr2) {
      this.args.push('--psr2');
    }

    if (!this.config.detect_indent) {
      const spaces: number | boolean = this.config.indent_with_space;
      if (spaces === true) {
        this.args.push('--indent_with_space');
      } else if (spaces > 0) {
        this.args.push(`--indent_with_space=${spaces}`);
      }
    }

    if (this.config.enable_auto_align) {
      this.args.push('--enable_auto_align');
    }

    if (this.config.visibility_order) {
      this.args.push('--visibility_order');
    }

    const passes: Array<string> = this.config.passes;
    if (passes.length > 0) {
      this.args.push(`--passes=${passes.join(',')}`);
    }

    const exclude: Array<string> = this.config.exclude;
    if (exclude.length > 0) {
      this.args.push(`--exclude=${exclude.join(',')}`);
    }

    if (this.config.smart_linebreak_after_curly) {
      this.args.push('--smart_linebreak_after_curly');
    }

    if (this.config.yoda) {
      this.args.push('--yoda');
    }

    if (this.config.cakephp) {
      this.args.push('--cakephp');
    }
  }

  public getConfig(): IPHPFmtConfig {
    return this.config;
  }

  private getArgs(fileName: string): Array<string> {
    const args: Array<string> = this.args.slice(0);
    args.push(fileName);
    return args;
  }

  public format(context: ExtensionContext, text: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.config.detect_indent) {
        const indentInfo: detectIndent.IndentInfo = detectIndent(text);
        if (!indentInfo.type) {
          // fallback to default
          this.args.push('--indent_with_space');
        } else if (indentInfo.type === 'space') {
          this.args.push(`--indent_with_space=${indentInfo.amount}`);
        }
      }

      try {
        const stdout: Buffer = execSync(
          `${this.config.php_bin} -r "echo PHP_VERSION_ID;"`
        );
        if (Number(stdout.toString()) < 50600) {
          return reject(new Error('phpfmt: php version < 5.6'));
        }
      } catch (err) {
        return reject(new Error('phpfmt: cannot find php bin'));
      }

      const tmpDir: string = os.tmpdir();

      const fileName: string = `${tmpDir}/temp-${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 10)}.php`;

      try {
        fs.writeFileSync(fileName, text);
      } catch (e) {
        this.widget.addToOutput(e.message);
        return reject(
          new Error(`phpfmt: cannot create tmp file in "${tmpDir}"`)
        );
      }

      // test whether the php file has syntax error
      try {
        execSync(`${this.config.php_bin} -l ${fileName}`);
      } catch (e) {
        this.widget.addToOutput(e.message);
        Window.setStatusBarMessage(
          'phpfmt: format failed - syntax errors found',
          4500
        );
        return reject();
      }

      const args: Array<string> = this.getArgs(fileName);
      args.unshift(path.join(context.extensionPath, PHPFmt.pharRelPath));

      const exec: ChildProcess = spawn(this.config.php_bin, args);
      this.widget.addToOutput(`${this.config.php_bin} ${args.join(' ')}`);

      exec.addListener('error', e => {
        this.widget.addToOutput(e.message);
        reject(new Error('phpfmt: run phpfmt failed'));
      });
      exec.addListener('exit', (code: number) => {
        if (code === 0) {
          const formatted: string = fs.readFileSync(fileName, 'utf-8');
          if (formatted.length > 0) {
            resolve(formatted);
          } else {
            reject();
          }
        } else {
          reject(new Error(`phpfmt: fmt.phar returns an invalid code ${code}`));
        }

        try {
          fs.unlinkSync(fileName);
        } catch (err) {}
      });
    });
  }
}

export default PHPFmt;
