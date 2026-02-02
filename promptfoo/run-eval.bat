@echo off
REM Load environment variables from parent .env file and run promptfoo eval

REM Read ANTHROPIC_API_KEY from parent .env
for /f "tokens=1,2 delims==" %%a in ('findstr "ANTHROPIC_API_KEY" ..\\.env') do (
    set %%a=%%b
)

REM Run promptfoo eval
npx promptfoo eval %*
