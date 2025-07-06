<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
    Schema::table('users', function (Blueprint $table) {
            $table->string('state')->nullable();
            $table->string('gender')->nullable();
            $table->string('address')->nullable();
        });

        Schema::table('admins', function (Blueprint $table) {
            $table->string('state')->nullable();
            $table->string('gender')->nullable();
            $table->string('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
};