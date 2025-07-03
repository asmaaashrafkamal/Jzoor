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
        Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('tags');
                $table->decimal('price', 10, 2);
                $table->decimal('discounted_price', 10, 2)->nullable();
                $table->boolean('tax_included')->default(true);
                $table->integer('stock_quantity')->nullable();
                $table->enum('stock_status', ['In Stock', 'Out of Stock'])->default('In Stock');
                $table->boolean('highlight')->default(false);
                $table->string('image')->nullable();
                $table->enum('status', allowed: ['Rejected', 'Pending','Accepted'])->default('Pending');
                $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
