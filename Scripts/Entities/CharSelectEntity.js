class CharSelectEntity extends Entity
{
	constructor( map )
	{
		super( new Vec2( -100,-100 ),new Vec2( 1,1 ) )
		
		this.bottleSpots = []
		for( let y = 0; y < map.height; ++y )
		{
			for( let x = 0; x < map.width; ++x )
			{
				if( map.GetTile( x,y ) == 4 ) this.bottleSpots.push( new Vec2( x,y ) )
			}
		}
		
		this.bottleRefreshCheck = new Timer( 1.5 )
	}
	
	Update( info )
	{
		if( this.bottleRefreshCheck.Update() )
		{
			this.bottleRefreshCheck.Reset()
			
			let hasBottle = false
			for( const tile of this.bottleSpots )
			{
				if( info.map.GetTile( tile.x,tile.y ) == 4 )
				{
					hasBottle = true
					break
				}
			}
			
			if( !hasBottle )
			{
				for( const tile of this.bottleSpots )
				{
					info.map.SetTile( tile.x,tile.y,4 )
				}
			}
		}
	}
	
	Draw( gfx ) {}
}