class TownArea extends Area
{
	GenerateMap( map )
	{
		map.CreateWalledEmptyMap()
		
		// todo: tile generation
		
		const edgeWidth = 3
		this.mapEdges = [
			new Rect( 1,edgeWidth + 1,1,map.width - 1 ), // top
			new Rect( map.height - edgeWidth - 1,map.height - 1,1,map.width - 1 ), // bot
			new Rect( 1,map.height - 1,1,edgeWidth + 1 ), // left
			new Rect( 1,map.height - 1,map.width - edgeWidth - 1,map.width - 1 ) // right
		]
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		
		switch( this.curWave )
		{
		case 0:
			this.SpawnEnemies( 0,3,enemies,map )
			break
		case 1:
			this.SpawnEnemies( 0,2,enemies,map )
			this.SpawnEnemies( 1,2,enemies,map )
			break
		case 2:
			this.SpawnEnemies( 0,4,enemies,map )
			this.SpawnEnemies( 1,2,enemies,map )
			this.SpawnEnemies( 2,1,enemies,map )
			break
		case 3:
			this.SpawnEnemies( 0,4,enemies,map )
			this.SpawnEnemies( 1,3,enemies,map )
			this.SpawnEnemies( 2,3,enemies,map )
			break
		default:
			this.SpawnEnemies( -1,3,enemies,map )
			break
		}
		
		return( enemies )
	}
	
	// spawn archers around edge, thief on left & warrior on right
	SpawnEnemies( type,amount,enemyList,map )
	{
		for( let i = 0; i < amount; ++i )
		{
			let enemy = null
			switch( type )
			{
			case 0: // archer
				enemy = new BanditArcher( map.Tile2WorldPos(
					this.mapEdges[Utils.RandInt( 0,this.mapEdges.length )]
					.GetRandPos() ).Add( Vec2.One().Scale( 4 ) ) )
				break
			case 1: // thief
				enemy = new Thief( map.Tile2WorldPos(
					this.mapEdges[2]
					.GetRandPos() ).Add( Vec2.One().Scale( 4 ) ) )
				break
			case 2: // warrior
				enemy = new BanditWarrior( map.Tile2WorldPos(
					this.mapEdges[3]
					.GetRandPos() ).Add( Vec2.One().Scale( 4 ) ) )
				break
			default:
				enemy = new Enemy( new Vec2( 50,50 ) )
				break
			}
			enemyList.push( enemy )
		}
	}
	
	GenerateBoss( map )
	{
		return( new BanditChief( map.Tile2WorldPos( map.GetCenterTile() ) ) )
	}
}