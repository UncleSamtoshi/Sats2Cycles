{ pkgs }: {
	deps = [
		pkgs.imagemagick6_light
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.nodePackages.yarn
        pkgs.replitPackages.jest
	];
}