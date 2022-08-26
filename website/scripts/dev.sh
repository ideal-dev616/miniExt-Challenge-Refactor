
set -e

# If you do not have the firebase emulator, you can install with the following command:
# curl -sL firebase.tools | bash

yarn kill-ports


cross-env  NEXT_PUBLIC_GIT_SHA=`git rev-parse --short HEAD` yarn next dev