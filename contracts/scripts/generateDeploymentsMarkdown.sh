#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

IGNORED_ARTIFACTS=(
    "CREATE3Factory.json"
    "MetaEvidence_*"
    "PNK.json"
    "DAI.json"
    "WETH.json"
    "RandomizerOracle.json"
    "_Implementation.json"
    "_Proxy.json"
)

function generate() { #deploymentDir #explorerUrl
    deploymentDir=$1
    explorerUrl=$2
    # shellcheck disable=SC2068
    for f in $(ls -1 $deploymentDir/*.json 2>/dev/null | grep -v ${IGNORED_ARTIFACTS[@]/#/-e } | sort); do
        contractName=$(basename $f .json)
        address=$(cat $f | jq -r .address)
        implementation=$(cat $f | jq -r .implementation)
        
        if [ "$implementation" != "null" ]; then
            echo "- [$contractName: proxy]($explorerUrl$address), [implementation]($explorerUrl$implementation)"
        else
            echo "- [$contractName]($explorerUrl$address)"
        fi
    done
}

echo "### Production"
echo "#### Arbitrum One"
echo
generate "$SCRIPT_DIR/../deployments/arbitrum" "https://arbiscan.io/address/"
echo
echo "### Official Testnet"
echo "#### Arbitrum Sepolia"
echo
generate "$SCRIPT_DIR/../deployments/arbitrumSepolia" "https://sepolia.arbiscan.io/address/"
echo
echo "### Devnet"
echo "#### Arbitrum Sepolia"
echo
generate "$SCRIPT_DIR/../deployments/arbitrumSepoliaDevnet" "https://sepolia.arbiscan.io/address/"
