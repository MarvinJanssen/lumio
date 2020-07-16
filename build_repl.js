var shell = require('shelljs');

var target = 'public/build/clarity_repl.wasm';

shell.echo('Will attempt to fetch the Clarity REPL source code and build the WASM library');

if (shell.test('-ef',target))
	{
	shell.echo('Target '+target+' already exists, use \'npm run clean:repl\' or manually delete the file before building');
	shell.exit(0);
	}

if (!shell.which('git') || !shell.which('cargo'))
	{
	shell.echo('build:repl requires git and cargo, see README.md for more information')
	shell.exit(1);
	}

if (!shell.which('wasm-pack'))
	{
	shell.echo('build:repl requires wasm-pack, install it using \'cargo install wasm-pack\', see README.md for more information')
	shell.exit(1);
	}

var github_url = process.argv[2] || 'https://github.com/lgalabru/clarity-repl';
var working_directory = shell.tempdir()+'/_clarity_repl';
shell.rm('-rf',working_directory);

if (!process.argv[2])
	shell.echo('No Github URL given, assuming \''+github_url+"'\nIf you want to define a custom url, run 'npm run build:repl <url>'");

if (shell.exec('git clone "'+github_url+'" '+working_directory).code !== 0)
	{
	shell.echo('git clone of '+github_url+' failed, or no rights to write to the folder');
	shell.exit(1);
	}

shell.pushd(working_directory);
shell.exec('wasm-pack build --target web --release -- --no-default-features --features wasm');
shell.popd();
shell.rm('-rf',target);
shell.cp(working_directory+'/pkg/clarity_repl_bg.wasm',target);
shell.rm('-rf',working_directory);
shell.echo('Placed the WASM at '+target);
shell.echo('Build complete, Clarity REPL now available');
shell.exit(0);
