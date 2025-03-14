class PlayerManager
{
	constructor()
	{
		this.players = []
		
		this.ctrls = [
			new WASDControl( "W","S","A","D" ),
			new WASDControl( 38,40,37,39 ),
			new WASDControl( "I","K","J","L" ),
			new MouseControl(),
			new GamepadControl( 0,0,10 ),
			new GamepadControl( 0,1,11 )
		]
		
		this.deadPlayers = []
		
		this.maxPlayers = this.ctrls.length
		
		this.colors = [
			"white",
			"black",
			"darkturquoise",
			"slateblue",
			"darksalmon",
			"mediumseagreen"
		]
		
		this.canAdd = false
		this.canRemove = false
		
		this.enemyList = []
		this.playerBullets = []
		this.enemyBullets = []
		
		this.mode = PlayerManager.CharSelectMode
	}
	
	Update( mouse,kbd,gpad,map,enemies,playerBullets,enemyBullets,gfx,attackArea )
	{
		const playerUpdateInfo = {}
		playerUpdateInfo.mouse = mouse
		playerUpdateInfo.kbd = kbd
		playerUpdateInfo.gpad = gpad
		playerUpdateInfo.map = map
		playerUpdateInfo.enemies = enemies
		playerUpdateInfo.playerBullets = playerBullets
		playerUpdateInfo.enemyBullets = enemyBullets
		playerUpdateInfo.gfx = gfx
		playerUpdateInfo.attackArea = attackArea
		
		for( const player of this.players )
		{
			player.Update( playerUpdateInfo )
			
			player.UpdateMisc()
		}
		
		// const addDown = kbd.KeyDown( 187 )
		// const removeDown = kbd.KeyDown( 189 )
		// if( addDown && this.canAdd )
		// {
		// 	this.AddPlayer( map.Tile2WorldPos( map.GetRandEmptyTilePos() ),map )
		// }
		// else if( removeDown && this.canRemove )
		// {
		// 	this.RemovePlayer()
		// }
		// this.canAdd = !addDown
		// this.canRemove = !removeDown
		
		if( this.mode == PlayerManager.ArcadeMode )
		{
			for( let i = 0; i < this.players.length; ++i )
			{
				const curPlayer = this.players[i]
				if( curPlayer.isPlaceholder && curPlayer.SpawnIn() )
				{
					let spawnPos = map.Tile2WorldPosCentered( map.GetRandEmptyTilePos() )
					// if( this.players[i].ctrls.isMouse )
					// {
					// 	const mouseTile = map.World2TilePos( mouse.GetPos() )
					// 	if( map.IsTileOnScreen( mouseTile.x,mouseTile.y ) &&
					// 		map.IsWalkableTile( mouseTile.x,mouseTile.y ) )
					// 	{
					// 		spawnPos = map.Tile2WorldPos( mouseTile )
					// 	}
					// }
					
					const newPlayer = this.SpawnSpecificPlayer(
						Utils.ArrayChooseRand( this.GetAvailableCharIds() ),
						this.players[i].ctrls,
						spawnPos,
						map )
					this.players.splice( i,1,newPlayer )
				}
			}
		}
		
		this.CheckForGhosts()
	}
	
	Draw( gfx )
	{
		for( const player of this.players ) player.Draw( gfx )
	}
	
	SpawnSpecificPlayer( index,ctrls,pos,map )
	{
		// if( this.players.length < this.maxPlayers )
		{
			const playerPos = pos.Copy().Add( Vec2.One().Scale( map.tileSize / 2 ) )
			const player = this.CreatePlayerById( index,pos,ctrls )
			player.SetPlayerId( index )
			
			player.SetupInfo( this.enemyList,this.playerBullets,this.players,this.enemyBullets )
			
			return( player )
		}
	}
	
	CreatePlayerById( id,pos,ctrls )
	{
		switch( id )
		{
			case 0: return( new Knight( pos,ctrls ) )
			case 1: return( new Archer( pos,ctrls ) )
			case 2: return( new Healer( pos,ctrls ) )
			case 3: return( new Rogue( pos,ctrls ) )
			case 4: return( new Lancer( pos,ctrls ) )
			case 5: return( new Wizard( pos,ctrls ) )
		}
	}
	
	CheckForGhosts()
	{
		for( let i = 0; i < this.players.length; ++i )
		{
			if( this.players[i].hp <= 0 && !this.players[i].isGhost )
			{
				this.players[i].OnKill()
				if( this.players[i].Inactive() )
				{
					this.players[i].ctrls.Reset()
					this.players[i] = new PlaceholderPlayer( this.players[i].ctrls )
				}
				else
				{
					this.deadPlayers[i] = this.players[i]
					this.players[i] = new Ghost( this.players[i].pos.Copy(),
						this.players[i].ctrls )
				}
			}
		}
	}
	
	TryReviveGhosts()
	{
		if( this.mode != PlayerManager.CharSelectMode )
		{
			// if( this.GetLivingPlayers().length != this.GetAllPlayers().length ) console.log( "no reviving allowed!" )
			
			for( let i = 0; i < this.players.length; ++i )
			{
				if( this.players[i].isGhost )
				{
					this.players[i] = this.deadPlayers[i]
					this.players[i].hp = this.players[i].maxHP
				}
			}
			
			this.deadPlayers = []
		}
	}
	
	SetInfo( enemies,playerBullets,enemyBullets )
	{
		this.enemyList = enemies
		this.playerBullets = playerBullets
		this.enemyBullets = enemyBullets
	}
	
	SetMode( mode )
	{
		this.mode = mode
		
		// set up placeholder players when switching to arcade mode
		if( mode == PlayerManager.ArcadeMode )
		{
			const availableCtrls = []
			for( const ctrl of this.ctrls )
			{
				let ctrlFree = true
				for( let i = 0; i < this.players.length; ++i )
				{
					if( this.players[i].ctrls == ctrl )
					{
						ctrlFree = false
						i = this.players.length
					}
				}
				if( ctrlFree ) availableCtrls.push( ctrl )
			}
			for( const ctrl of availableCtrls ) this.players.push( new PlaceholderPlayer( ctrl ) )
		}
	}
	
	SpawnCharSelectGhosts( tileList,map )
	{
		this.players.length = 0
		for( let i = 0; i < this.maxPlayers; ++i )
		{
			this.players.push( new Ghost( map.Tile2WorldPosCentered( tileList[i] ),this.ctrls[i] ) )
		}
	}
	
	SpawnPlayerSwapEntities( tileList,map,entities )
	{
		for( let i = 0; i < this.maxPlayers; ++i )
		{
			entities.push( new PlayerSwapEntity( map.Tile2WorldPosCentered( tileList[i] ),
				i,this.CreatePlayerById( i,Vec2.Zero(),this.ctrls[0] ) ) )
		}
	}
	
	PossessPlayer( ghost,playerId,spawnPos,map )
	{
		for( let i = 0; i < this.players.length; ++i )
		{
			if( this.players[i] == ghost )
			{
				this.players[i] = this.SpawnSpecificPlayer( playerId,ghost.ctrls,spawnPos,map )
				return
			}
		}
	}
	
	ClearUnusedGhosts()
	{
		for( let i = 0; i < this.players.length; ++i )
		{
			if( this.players[i].isGhost ) this.players.splice( i--,1 )
		}
	}
	
	// move players to valid tiles at start of new area
	CenterPlayers( map )
	{
		for( const player of this.players )
		{
			const spawnPos = map.Tile2WorldPosCentered( map.GetRandEmptyTilePos() )
			player.pos = spawnPos
		}
	}
	
	GetLivingPlayers()
	{
		// return( this.players )
		const players = []
		for( const player of this.players )
		{
			if( !player.isGhost && !player.isPlaceholder ) players.push( player )
		}
		return( players )
	}
	
	GetPlayerTargets()
	{
		const players = []
		for( const player of this.players )
		{
			if( !player.isGhost && player.targetable ) players.push( player )
		}
		return( players )
	}
	
	GetAllPlayers()
	{
		return( this.players )
	}
	
	AllPlayersGhosts()
	{
		for( const player of this.players )
		{
			if( !player.isGhost && !player.isPlaceholder ) return( false )
		}
		return( true )
	}
	
	ResetPlayerCtrls()
	{
		for( const player of this.players ) player.ctrls.Reset()
	}
	
	GetAvailableCharIds()
	{
		const available = []
		for( let i = 0; i < this.maxPlayers; ++i ) available.push( i )
		
		for( const player of this.players )
		{
			const id = player.GetPlayerId()
			if( id > 0 )
			{
				for( let i = 0; i < available.length; ++i )
				{
					if( available[i] == id )
					{
						available.splice( i,1 )
						i = available.length
					}
				}
			}
		}
		
		return( available )
	}
}

PlayerManager.CharSelectMode = 0
PlayerManager.RegularAreaMode = 1
PlayerManager.ArcadeMode = 2