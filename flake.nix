{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: 
    flake-utils.lib.eachDefaultSystem
        (system:
            let pkgs = nixpkgs.legacyPackages.${system}; in
            {
                devShells.default = pkgs.mkShell {
                    nativeBuildInputs = with pkgs; [
                        bun
                        playwright-driver.browsers
                    ];

                    shellHook = ''
                      export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
                    '';
                };
            }
        );
}
