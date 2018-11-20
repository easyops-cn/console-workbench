cask 'console-workbench' do
  version '1.3.2'
  sha256 :no_check

  url 'https://github.com/easyops-cn/console-workbench/releases/download/v1.3.2/ConsoleWorkbench-1.3.2-mac.zip'
  name 'Console Workbench'
  homepage 'https://github.com/easyops-cn/console-workbench'

  app 'ConsoleWorkbench.app'
end
