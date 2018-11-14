cask 'console-workbench' do
  version '1.1.0'
  sha256 :no_check

  url 'https://github.com/easyops-cn/console-workbench/releases/download/v1.1.0/ConsoleWorkbench-1.1.0-mac.zip'
  name 'Console Workbench'
  homepage 'https://github.com/easyops-cn/console-workbench'

  app 'ConsoleWorkbench.app'
end
