class SpriteCodex {}

SpriteCodex.sprites = []

SpriteCodex.LoadSpr = function( path )
{
	if( !SpriteCodex.sprites[path] )
	{
		SpriteCodex.sprites[path] = new Sprite( path )
	}
	
	return( SpriteCodex.sprites[path] )
}